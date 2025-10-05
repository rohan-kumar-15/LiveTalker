const express = require('express');
const cors = require('cors')
const app = express();
const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');



// use auth controller routers
app.use(cors())
app.use(express.json({
    limit: "50mb"
}));
const server = require('http').createServer(app);

const io = require('socket.io')(server, {cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
}})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const onlineUser = [];
//TEST SOCKET CONNECTION FROM CLIENT

const userSocketMap = {}; // userId <-> socket.id map

io.on('connection', (socket) => {
    // Join personal room
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });

    socket.on('user-login', (userId) => {
        if (!onlineUser.includes(userId)) {
            onlineUser.push(userId);
        }
        userSocketMap[socket.id] = userId; // Map socket to user
        io.emit('online-users-updated', onlineUser);
    });

    socket.on('user-offline', (userId) => {
        const index = onlineUser.indexOf(userId);
        if (index !== -1) {
            onlineUser.splice(index, 1);
        }
        io.emit('online-users-updated', onlineUser);
    });

    // Handle unexpected disconnect (browser close/tab refresh)
    socket.on('disconnect', () => {
        const userId = userSocketMap[socket.id];
        if (userId) {
            const index = onlineUser.indexOf(userId);
            if (index !== -1) {
                onlineUser.splice(index, 1);
            }
            delete userSocketMap[socket.id];
            io.emit('online-users-updated', onlineUser);
        }
    });

    // Other events
    socket.on('send-message', (message) => {
        io.to(message.members[0]).to(message.members[1]).emit('receive-message', message);
        io.to(message.members[0]).to(message.members[1]).emit('set-message-count', message);
    });

    socket.on('clear-unread-messages', (data) => {
        io.to(data.members[0]).to(data.members[1]).emit('message-count-cleared', data);
    });

    socket.on('user-typing', (data) => {
        io.to(data.members[0]).to(data.members[1]).emit('started-typing', data);
    });
});




module.exports = server;
