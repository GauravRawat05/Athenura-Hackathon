/**
  socket.js
  Creates and exports a singleton Socket.IO instance bound to the HTTP server.
  Call `initializeSocket(httpServer)` once from server.js.
 */
import { Server } from 'socket.io';

let io = null;

export const initializeSocket = (httpServer) => {
  if (io) return io; // already initialised — do not double-bind

  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      credentials: true
    }
  });

  io.engine.on('connection_error', (err) => {
    console.error('Socket.IO connection error:', err.message);
  });

  return io;
};

/**
 * Returns the live io singleton. Throws if `initializeSocket` has not been called yet.
 */
export const getIO = () => {
  if (!io) {
    throw new Error(
      'Socket.io has not been initialised. ' +
      'Call initializeSocket(httpServer) in server.js before using this function.'
    );
  }
  return io;
};

// Export the reference — consumers that captured this reference at import time
// will see the updated value once initializeSocket runs.
export { io };
