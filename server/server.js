import "dotenv/config";
import http from "http";

import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import { initSocket } from "./socket/socket.js";
import { startBackgroundJobs } from "./jobs/index.js";

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);
  startBackgroundJobs();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
