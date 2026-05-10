import "dotenv/config";
import http from "node:http";
import { createExpressServer } from "./app/server.js";
import { env } from "./app/common/config/envValidate.js";

async function main() {
  const server = http.createServer(createExpressServer());
  const PORT = Number(env.PORT) || 8080;

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();