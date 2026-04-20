const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path based on your structure

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
            // Get token from auth object or headers
            const token = socket.handshake.auth.token ||
                socket.handshake.headers.authorization.replace('Bearer ', '');

            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded.id).select('+role');

            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }

            // Check if user is active
            if (user.active === false) {
                return next(new Error('Authentication error: Account deactivated'));
            }

            // Attach user to socket
            socket.user = user;
            next();
        } catch (error) {
            console.error('Socket authentication error:', error.message);
            next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
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

        // Remove from last seen when user comes online
        if (userLastSeen.has(userId)) {
            userLastSeen.delete(userId);
            console.log(`🔄 Cleared last seen for user: ${socket.user.email}`);
        }

        // If user is admin, add them to the admin room
        if (socket.user.role === 'admin') {
            socket.join('admins');
            console.log(`👑 Admin joined admin room: ${socket.user.email}`);

            // Send current admin count to newly connected admin
            const adminCount = io.sockets.adapter.rooms.get('admins').size || 0;
            socket.emit('admin:connected', {
                message: 'Connected to admin room',
                activeAdmins: adminCount,
                userName: socket.user.name
            });

            // Notify other admins
            socket.to('admins').emit('admin:joined', {
                userName: socket.user.name,
                email: socket.user.email,
                timestamp: new Date()
            });

            // Send current online users list to the newly connected admin
            socket.emit('users:online_list', getOnlineUsersList());

            // Send last seen data for all offline users
            socket.emit('users:last_seen_list', getLastSeenList());
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

        // Admin requests current online users list
        socket.on('admin:request_online_users', () => {
            if (socket.user.role === 'admin') {
                socket.emit('users:online_list', getOnlineUsersList());
            }
        });

        // Admin requests last seen list
        socket.on('admin:request_last_seen', () => {
            if (socket.user.role === 'admin') {
                socket.emit('users:last_seen_list', getLastSeenList());
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.email}`);

            const disconnectTime = new Date();

            // Store last seen information
            userLastSeen.set(userId, {
                timestamp: disconnectTime,
                name: socket.user.name,
                email: socket.user.email,
                role: socket.user.role
            });

            console.log(`💾 Stored last seen for user: ${socket.user.email} at ${disconnectTime.toISOString()}`);

            // Remove user from online users map
            onlineUsers.delete(userId);

            // Broadcast to all admins that this user is now offline (with last seen)
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
                // Notify other admins
                socket.to('admins').emit('admin:left', {
                    userName: socket.user.name,
                    email: socket.user.email,
                    timestamp: disconnectTime
                });
            }
        });

        // Error handling
        socket.on('error', (error) => {
            console.error(`Socket error for user ${socket.user.email}:`, error);
        });
    });

    console.log('📡 Socket.IO initialized successfully');
    return io;
};

/**
 * Get list of online users
 * @returns {Array} Array of online user objects
 */
const getOnlineUsersList = () => {
    return Array.from(onlineUsers.entries()).map(([userId, userData]) => ({
        userId,
        ...userData
    }));
};

/**
 * Get list of users with last seen timestamps
 * @returns {Array} Array of users with last seen data
 */
const getLastSeenList = () => {
    return Array.from(userLastSeen.entries()).map(([userId, data]) => ({
        userId,
        ...data
    }));
};

/**
 * Check if a user is currently online
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is online
 */
const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
};

/**
 * Get last seen timestamp for a user
 * @param {string} userId - User ID to check
 * @returns {Date|null} Last seen timestamp or null if never seen offline
 */
const getUserLastSeen = (userId) => {
    const lastSeenData = userLastSeen.get(userId.toString());
    return lastSeenData ? lastSeenData.timestamp : null;
};

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO instance
 * @throws {Error} If Socket.IO is not initialized
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initSocket first.');
    }
    return io;
};

/**
 * Send notification to specific user
 * @param {string} userId - User ID to notify
 * @param {Object} notification - Notification data
 */
const sendUserNotification = (userId, notification) => {
    try {
        const io = getIO();
        const userIdStr = userId.toString();

        const notificationData = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: notification.type, // 'booking', 'discount', 'payment', 'cancellation', etc.
            title: notification.title,
            message: notification.message,
            data: notification.data || {}, // Additional data (booking details, discount info, etc.)
            timestamp: new Date(),
            read: false,
            link: notification.link || null // Optional: Link to navigate to
        };

        // Emit to user's personal room
        io.to(`user:${userIdStr}`).emit('notification:new', notificationData);

        // Also emit to admins for monitoring
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
 * Send notification to multiple users
 * @param {Array} userIds - Array of user IDs
 * @param {Object} notification - Notification data
 */
const sendBulkNotification = (userIds, notification) => {
    try {
        const results = userIds.map(userId =>
            sendUserNotification(userId, notification)
        );

        console.log(`🔔 Sent bulk notification to ${userIds.length} users`);
        return results;
    } catch (error) {
        console.error('❌ Failed to send bulk notification:', error.message);
        return [];
    }
};

/**
 * Send notification to all online users
 * @param {Object} notification - Notification data
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

        // Send to all connected clients
        io.emit('notification:new', notificationData);

        console.log(`📢 Broadcast notification sent to all users`);
        return notificationData;
    } catch (error) {
        console.error('❌ Failed to send broadcast notification:', error.message);
        return null;
    }
};

/**
 * Send notification to all connected admins
 * @param {Object} notification - Notification data
 * @returns {Object|null} Notification payload
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

        io.to('admins').emit('notification:new', notificationData);
        console.log('🔔 Sent notification to all admins');
        return notificationData;
    } catch (error) {
        console.error('❌ Failed to send admin notification:', error.message);
        return null;
    }
};

/**
 * Emit user activity to admins only
 * @param {string} eventType - 'signup' or 'login'
 * @param {Object} userData - User data to send
 */
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

        // Emit only to admin room
        io.to('admins').emit('user:activity', activityData);

        console.log(`📡 Emitted ${eventType} activity to admins for user: ${userData.email}`);
    } catch (error) {
        console.error('❌ Failed to emit user activity:', error.message);
        // Don't throw - socket emission failure shouldn't break the flow
    }
};

/**
 * Emit custom event to admins
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
const emitToAdmins = (eventName, data) => {
    try {
        const io = getIO();

        const eventData = {
            ...data,
            timestamp: data.timestamp || new Date()
        };

        // Keep the original event for admin dashboards listening to custom events.
        io.to('admins').emit(eventName, eventData);

        // Also emit a standard notification event because the frontend notification
        // store currently listens on "notification:new".
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
}

/**
 * Emit event to all connected users
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
const emitToAll = (eventName, data) => {
    try {
        const io = getIO();
        io.emit(eventName, data);
        console.log(`📡 Emitted ${eventName} to all users`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

/**
 * Emit event to specific user by socket ID
 * @param {string} socketId - Socket ID
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
const emitToUser = (socketId, eventName, data) => {
    try {
        const io = getIO();
        io.to(socketId).emit(eventName, data);
        console.log(`📡 Emitted ${eventName} to user ${socketId}`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

/**
 * Get online users count
 * @returns {number} Number of online users
 */
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