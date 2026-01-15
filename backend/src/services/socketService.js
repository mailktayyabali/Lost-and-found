import { Server } from 'socket.io';

let io;

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Allow client to register their user-specific room
    socket.on('register', (userId) => {
      if (!userId) return;
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} registered for user room ${room}`);
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation: ${conversationId}`);
    });

    // Handle typing events
    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing', { userId });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('stop_typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export {
  init,
  getIo
};
