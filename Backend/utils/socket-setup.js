const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const PendingNotification = require('../models/notificationModel');

let io;
const onlineUsers = new Map(); // Map of userId -> { socketId, name, email, role, connectedAt }
const userLastSeen = new Map(); // Map of userId -> { timestamp, name, email }

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance
 */
const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || '*',
            credentials: true,
            methods: ['GET', 'POST']
        },
        transports: ['websocket', 'polling']
    });

    // Socket.IO authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token ||
                socket.handshake.headers.authorization.replace('Bearer ', '');

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('+role');

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            if (user.active === false) {
                return next(new Error('Authentication error: Account deactivated'));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error('Socket authentication error:', error.message);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.user._id.toString();

        console.log(`✅ User connected: ${socket.user.name} (${socket.user.email})`);
        socket.join(`user:${userId}`);
        console.log(`👤 User joined user room: ${socket.user.email}`);

        // Add user to online users map
        onlineUsers.set(userId, {
            socketId: socket.id,
            name: socket.user.name,
            email: socket.user.email,
            role: socket.user.role,
            connectedAt: new Date()
        });

        // --- Flush pending notifications from DB ---
        try {
            const queued = await PendingNotification.find({
                userId,
                forAdmin: false
            }).sort({ createdAt: 1 }).lean();

            if (queued.length > 0) {
                queued.forEach(({ notification }) => {
                    socket.emit('notification:new', notification);
                });
                await PendingNotification.deleteMany({ userId, forAdmin: false });
                console.log(`📬 Delivered ${queued.length} queued notifications to ${socket.user.email}`);
            }
        } catch (err) {
            console.error(`❌ Failed to flush notifications for ${socket.user.email}:`, err.message);
        }

        // Remove from last seen when user comes online
        if (userLastSeen.has(userId)) {
            userLastSeen.delete(userId);
            console.log(`🔄 Cleared last seen for user: ${socket.user.email}`);
        }

        // If user is admin, add them to the admin room
        if (socket.user.role === 'admin') {
            socket.join('admins');
            console.log(`👑 Admin joined admin room: ${socket.user.email}`);

            const adminCount = io.sockets.adapter.rooms.get('admins').size || 0;
            socket.emit('admin:connected', {
                message: 'Connected to admin room',
                activeAdmins: adminCount,
                userName: socket.user.name
            });

            socket.to('admins').emit('admin:joined', {
                userName: socket.user.name,
                email: socket.user.email,
                timestamp: new Date()
            });

            socket.emit('users:online_list', getOnlineUsersList());
            socket.emit('users:last_seen_list', getLastSeenList());

            // --- Flush pending admin notifications from DB ---
            try {
                const queuedAdmin = await PendingNotification.find({
                    userId,
                    forAdmin: true
                }).sort({ createdAt: 1 }).lean();

                if (queuedAdmin.length > 0) {
                    queuedAdmin.forEach(({ notification }) => {
                        socket.emit('notification:new', notification);
                    });
                    await PendingNotification.deleteMany({ userId, forAdmin: true });
                    console.log(`📬 Delivered ${queuedAdmin.length} queued admin notifications to ${socket.user.email}`);
                }
            } catch (err) {
                console.error(`❌ Failed to flush admin notifications for ${socket.user.email}:`, err.message);
            }
        }

        // Broadcast to all admins that this user is now online
        io.to('admins').emit('user:status_change', {
            userId: userId,
            status: 'online',
            user: {
                id: userId,
                name: socket.user.name,
                email: socket.user.email,
                role: socket.user.role
            },
            timestamp: new Date()
        });

        // Handle custom events
        socket.on('admin:request_stats', async () => {
            if (socket.user.role === 'admin') {
                try {
                    const totalUsers = await User.countDocuments();
                    const activeUsers = await User.countDocuments({ active: true });
                    const adminCount = await User.countDocuments({ role: 'admin' });

                    socket.emit('admin:stats', {
                        totalUsers,
                        activeUsers,
                        adminCount,
                        connectedAdmins: io.sockets.adapter.rooms.get('admins').size || 0,
                        onlineUsers: onlineUsers.size
                    });
                } catch (error) {
                    console.error('Error fetching stats:', error);
                    socket.emit('error', { message: 'Failed to fetch stats' });
                }
            }
        });

        socket.on('admin:request_online_users', () => {
            if (socket.user.role === 'admin') {
                socket.emit('users:online_list', getOnlineUsersList());
            }
        });

        socket.on('admin:request_last_seen', () => {
            if (socket.user.role === 'admin') {
                socket.emit('users:last_seen_list', getLastSeenList());
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.email}`);

            const disconnectTime = new Date();

            userLastSeen.set(userId, {
                timestamp: disconnectTime,
                name: socket.user.name,
                email: socket.user.email,
                role: socket.user.role
            });

            console.log(`💾 Stored last seen for user: ${socket.user.email} at ${disconnectTime.toISOString()}`);

            onlineUsers.delete(userId);

            io.to('admins').emit('user:status_change', {
                userId: userId,
                status: 'offline',
                user: {
                    id: userId,
                    name: socket.user.name,
                    email: socket.user.email,
                    role: socket.user.role
                },
                lastSeen: disconnectTime,
                timestamp: disconnectTime
            });

            if (socket.user.role === 'admin') {
                socket.to('admins').emit('admin:left', {
                    userName: socket.user.name,
                    email: socket.user.email,
                    timestamp: disconnectTime
                });
            }
        });

        socket.on('error', (error) => {
            console.error(`Socket error for user ${socket.user.email}:`, error);
        });
    });

    console.log('📡 Socket.IO initialized successfully');
    return io;
};

const getOnlineUsersList = () => {
    return Array.from(onlineUsers.entries()).map(([userId, userData]) => ({
        userId,
        ...userData
    }));
};

const getLastSeenList = () => {
    return Array.from(userLastSeen.entries()).map(([userId, data]) => ({
        userId,
        ...data
    }));
};

const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
};

const getUserLastSeen = (userId) => {
    const lastSeenData = userLastSeen.get(userId.toString());
    return lastSeenData ? lastSeenData.timestamp : null;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initSocket first.');
    }
    return io;
};

/**
 * Send notification to a specific user.
 * If the user is offline the notification is persisted to MongoDB
 * and delivered the next time they connect.
 *
 * @param {string} userId
 * @param {Object} notification
 * @returns {Promise<Object|null>}
 */
const sendUserNotification = async (userId, notification) => {
    try {
        const io = getIO();
        const userIdStr = userId.toString();

        const notificationData = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data || {},
            timestamp: new Date(),
            read: false,
            link: notification.link || null
        };

        if (isUserOnline(userIdStr)) {
            io.to(`user:${userIdStr}`).emit('notification:new', notificationData);
        } else {
            // Persist to DB so it survives server restarts
            await PendingNotification.create({
                userId: userIdStr,
                notification: notificationData,
                forAdmin: false
            });
            console.log(`📬 User ${userIdStr} offline — notification persisted to DB`);
        }

        // Let admins monitor all outgoing notifications
        io.to('admins').emit('notification:sent', {
            userId: userIdStr,
            notification: notificationData
        });

        console.log(`🔔 Sent ${notification.type} notification to user: ${userIdStr}`);
        return notificationData;
    } catch (error) {
        console.error('❌ Failed to send user notification:', error.message);
        return null;
    }
};

/**
 * Send notification to multiple users.
 * @param {Array} userIds
 * @param {Object} notification
 * @returns {Promise<Array>}
 */
const sendBulkNotification = async (userIds, notification) => {
    try {
        const results = await Promise.all(
            userIds.map(userId => sendUserNotification(userId, notification))
        );
        console.log(`🔔 Sent bulk notification to ${userIds.length} users`);
        return results;
    } catch (error) {
        console.error('❌ Failed to send bulk notification:', error.message);
        return [];
    }
};

/**
 * Send notification to all currently connected users (no offline queue — broadcast only).
 * @param {Object} notification
 * @returns {Object|null}
 */
const sendBroadcastNotification = (notification) => {
    try {
        const io = getIO();

        const notificationData = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data || {},
            timestamp: new Date(),
            read: false,
            link: notification.link || null
        };

        io.emit('notification:new', notificationData);
        console.log('📢 Broadcast notification sent to all users');
        return notificationData;
    } catch (error) {
        console.error('❌ Failed to send broadcast notification:', error.message);
        return null;
    }
};

/**
 * Send notification to all admins.
 * Online admins receive it immediately via the 'admins' room.
 * Offline admins have it persisted to MongoDB so they get it on next connect.
 *
 * @param {Object} notification
 * @returns {Object|null}
 */
const sendAdminNotification = (notification) => {
    try {
        const io = getIO();

        const notificationData = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type || 'system',
            title: notification.title,
            message: notification.message,
            data: notification.data || {},
            timestamp: notification.timestamp || new Date(),
            read: false,
            link: notification.link || null
        };

        // Deliver to online admins immediately
        io.to('admins').emit('notification:new', notificationData);

        // Persist for offline admins
        User.find({ role: 'admin', active: true }).select('_id').lean()
            .then(async (admins) => {
                const offlineAdmins = admins.filter(
                    admin => !isUserOnline(admin._id.toString())
                );

                if (offlineAdmins.length === 0) return;

                await PendingNotification.insertMany(
                    offlineAdmins.map(admin => ({
                        userId: admin._id.toString(),
                        notification: notificationData,
                        forAdmin: true
                    }))
                );

                console.log(`📬 Queued admin notification for ${offlineAdmins.length} offline admin(s)`);
            })
            .catch(error => {
                console.error('❌ Failed to persist admin notifications:', error.message);
            });

        console.log('🔔 Sent notification to all admins');
        return notificationData;
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error.message);
        return null;
    }
};

const emitUserActivity = (eventType, userData) => {
    try {
        const io = getIO();

        const activityData = {
            type: eventType,
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                createdAt: userData.createdAt
            },
            timestamp: new Date(),
            message: eventType === 'signup'
                ? `New user signed up: ${userData.name}`
                : `User logged in: ${userData.name}`
        };

        io.to('admins').emit('user:activity', activityData);
        console.log(`📡 Emitted ${eventType} activity to admins for user: ${userData.email}`);
    } catch (error) {
        console.error('❌ Failed to emit user activity:', error.message);
    }
};

const emitToAdmins = (eventName, data) => {
    try {
        const io = getIO();

        const eventData = {
            ...data,
            timestamp: data.timestamp || new Date()
        };

        io.to('admins').emit(eventName, eventData);

        if (data && data.title && data.message) {
            sendAdminNotification({
                type: data.type,
                title: data.title,
                message: data.message,
                data: eventData,
                timestamp: eventData.timestamp,
                link: data.link || null
            });
        }

        console.log(`📡 Emitted ${eventName} to admins`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

const emitToAll = (eventName, data) => {
    try {
        const io = getIO();
        io.emit(eventName, data);
        console.log(`📡 Emitted ${eventName} to all users`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

const emitToUser = (socketId, eventName, data) => {
    try {
        const io = getIO();
        io.to(socketId).emit(eventName, data);
        console.log(`📡 Emitted ${eventName} to user ${socketId}`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

const getOnlineUsersCount = () => {
    return onlineUsers.size;
};

module.exports = {
    initSocket,
    getIO,
    emitUserActivity,
    emitToAdmins,
    emitToAll,
    emitToUser,
    isUserOnline,
    getUserLastSeen,
    getOnlineUsersList,
    getLastSeenList,
    getOnlineUsersCount,
    sendAdminNotification,
    sendBulkNotification,
    sendBroadcastNotification,
    sendUserNotification
};