import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trips.routes.js';
import activityRoutes from './routes/activities.routes.js';
import voteRoutes from './routes/votes.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './middleware/error.js';
import ticketRoutes from './routes/tickets.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Define allowed base origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
];

// Helper function to validate incoming origins (supports production and dynamic Vercel subdomains)
const originValidator = (origin, callback) => {
  if (!origin) return callback(null, true); // Allow server-to-server or postman requests
  
  if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    return callback(null, true);
  }
  
  return callback(new Error('Blocked by CORS policy'), false);
};

// 1. HTTP Express Middleware Config
app.use(cors({ 
  origin: originValidator, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Socket.io Setup Config Fixed to Use Dynamic Origin Matching
const io = new Server(server, {
  cors: {
    origin: originValidator,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/tickets', ticketRoutes);
app.use(errorHandler);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('AI Travel Planner API is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));