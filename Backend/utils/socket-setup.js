const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust path based on your structure

let io;
const onlineUsers = new Map(); // Map of userId -> { socketId, name, email, role, connectedAt }

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

        // Add user to online users map
        onlineUsers.set(userId, {
            socketId: socket.id,
            name: socket.user.name,
            email: socket.user.email,
            role: socket.user.role,
            connectedAt: new Date()
        });

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

        // Handle custom events (optional)
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

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.user.email}`);

            // Remove user from online users map
            onlineUsers.delete(userId);

            // Broadcast to all admins that this user is now offline
            io.to('admins').emit('user:status_change', {
                userId: userId,
                status: 'offline',
                user: {
                    id: userId,
                    name: socket.user.name,
                    email: socket.user.email,
                    role: socket.user.role
                },
                timestamp: new Date()
            });

            if (socket.user.role === 'admin') {
                // Notify other admins
                socket.to('admins').emit('admin:left', {
                    userName: socket.user.name,
                    email: socket.user.email,
                    timestamp: new Date()
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
 * Check if a user is currently online
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is online
 */
const isUserOnline = (userId) => {
    return onlineUsers.has(userId.toString());
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
        io.to('admins').emit(eventName, data);
        console.log(`📡 Emitted ${eventName} to admins`);
    } catch (error) {
        console.error(`❌ Failed to emit ${eventName}:`, error.message);
    }
};

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
    getOnlineUsersList,
    getOnlineUsersCount
};