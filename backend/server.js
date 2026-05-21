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


// Middleware
app.use(cors({ origin: [
    'http://localhost:5173', 
    process.env.CLIENT_URL // We will add this variable in Render later
  ], credentials: true })); // Vite default port
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
 
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

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