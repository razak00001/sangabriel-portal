const socketIo = require('socket.io');
const { saveMessage } = require('./controllers/messageController');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:3000", "https://sangabrielportal.varnyx.tech"],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Client joins a project room
    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project: ${projectId}`);
    });

    // Typing indicators
    socket.on('typing-start', ({ projectId, userName }) => {
      socket.to(projectId).emit('user-typing', { userName, isTyping: true });
    });

    socket.on('typing-stop', ({ projectId, userName }) => {
      socket.to(projectId).emit('user-typing', { userName, isTyping: false });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
