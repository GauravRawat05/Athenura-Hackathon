/**
  index.js
  Main Socket.IO entry point.
  Listens for connection events and delegates to the publishers.
  Import and call `initSockets(io)` from server.js after the IO instance is created.
 */
import { SOCKET_EVENTS } from './events.js';

/**
 * Registers all socket event listeners on the provided io instance.
 * Called once from server.js during application startup.
 * @param {import('socket.io').Server} io
 */
export const initSockets = (io) => {
  if (!io) {
    console.error('[Socket] No io instance passed to initSockets — aborting');
    return;
  }

  // ── Connection ────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Default room: every client joins their own user room
    socket.on('join-hackathon', (hackathonId) => {
      const room = `hackathon:${hackathonId}`;
      socket.join(room);
      console.log(`[Socket] Socket ${socket.id} joined room ${room}`);
      socket.emit(SOCKET_EVENTS.SERVER.PROGRESS_UPDATE, {
        message: `Joined room for hackathon ${hackathonId}`,
        hackathonId
      });
    });

    socket.on('leave-hackathon', (hackathonId) => {
      const room = `hackathon:${hackathonId}`;
      socket.leave(room);
      console.log(`[Socket] Socket ${socket.id} left room ${room}`);
    });

    // Disconnect log
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id} — reason: ${reason}`);
    });
  });

  console.log('[Socket] Initialised');
};
