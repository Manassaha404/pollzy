import "dotenv/config";
import http from "node:http";
import { createExpressServer } from "./app/server.js";
import { env } from "./app/common/config/envValidate.js";
import io from './app/common/config/socket.io.js';
async function main() {
  const PORT = Number(env.PORT) || 8080;

  
  const server = http.createServer(createExpressServer());
  io.attach(server);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();