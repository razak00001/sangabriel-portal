const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initSocket = require('./socket');
const errorHandler = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const fileRoutes = require('./routes/files');
const sectionRoutes = require('./routes/sections');
const rateRoutes = require('./routes/rates');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

// Controllers/Utils
const { autoArchiveProjects } = require('./controllers/projectController');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Health check for Render heartbeats
app.get('/health', (req, res) => res.status(200).send('OK'));

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'https://sangabrielportal.varnyx.tech'].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static('uploads'));

// Final Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Tasks on startup
  autoArchiveProjects(); 
  setInterval(autoArchiveProjects, 24 * 60 * 60 * 1000);
});
