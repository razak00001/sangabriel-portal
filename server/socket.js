const socketIo = require('socket.io');
const { saveMessage } = require('./controllers/messageController');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`User joined project: ${projectId}`);
    });

    socket.on('sendMessage', async (data) => {
      const savedMsg = await saveMessage(data);
      if (savedMsg) {
        io.to(data.projectId).emit('receiveMessage', savedMsg);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = initSocket;
