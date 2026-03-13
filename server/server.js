const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const fileRoutes = require('./routes/files');
const { saveMessage } = require('./controllers/messageController');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded files staticly for local dev

// Socket.io basic setup
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

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sangabriel')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
