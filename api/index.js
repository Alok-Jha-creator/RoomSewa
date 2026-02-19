import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io'; // ← NEW
import { createServer } from 'http'; // ← NEW

// Routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import listingRoutes from './routes/listing.route.js';
import uploadRoutes from './routes/upload.route.js';
import adminRoutes from './routes/admin.route.js';
import bookingRoutes from './routes/booking.route.js';
import messageRoutes from './routes/message.route.js'; // ← NEW

const app = express();
const httpServer = createServer(app); // ← NEW

// ─── SOCKET.IO SETUP ───
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Online users track गर्ने
let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User online भएपछि
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', onlineUsers);
  });

  // Message पठाउँदा
  socket.on('sendMessage', ({ senderId, receiverId, text, propertyId }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', {
        senderId,
        text,
        propertyId,
        createdAt: Date.now(),
      });
    }
  });

  // User offline भएपछि
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', onlineUsers);
  });
});

// ─── MIDDLEWARE ───
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── ROUTES ───
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/message', messageRoutes); // ← NEW

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ─── MONGODB + SERVER START ───
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    httpServer.listen(PORT, () => { // ← Changed app.listen to httpServer.listen
      console.log(`🚀 Server running on port ${PORT}`); // ← Fixed
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });