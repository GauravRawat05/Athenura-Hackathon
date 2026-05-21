import app from './src/app.js';
import connectDB from './src/config/db.js';
import envConfig from './src/config/envConfig.js';
import { verifyTransporter } from './src/config/mail.js';
import { runHackathonStatusSync } from './src/app.js';
import { createServer } from 'http';
import { initializeSocket } from './src/config/socket.js';
import { initSockets } from './src/sockets/index.js';

const port = envConfig.portNumber || 5000;

connectDB().then(async () => {
  await verifyTransporter();
  await runHackathonStatusSync();

  // Wrap the Express app in a raw HTTP server so Socket.IO can share the port
  const httpServer = createServer(app);

  // Create the singleton Socket.IO instance bound to the HTTP server
  const io = initializeSocket(httpServer);

  // Register socket event handlers (join-hackathon, disconnect, …)
  initSockets(io);

  httpServer.listen(port, () => {
    console.log(`SERVER RUNNING ON PORT: ${port}`);
    console.log(`Socket.IO ready`);
  });
}).catch(err => console.error(err));
