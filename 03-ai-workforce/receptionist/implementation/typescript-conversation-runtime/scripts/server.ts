import {
  createReceptionistApplication,
  createReceptionistExperience,
} from "../src/composition/index.js";
import { createReceptionistHttpServer } from "../src/channels/http/receptionist-http-server.js";

const PORT = 4000;
const application = createReceptionistApplication();
const experience = createReceptionistExperience(application);
const server = createReceptionistHttpServer(experience);

server.listen(PORT, () => {
  console.log(
    `Ovzaro Receptionist listening on http://localhost:${String(PORT)}`,
  );
});

let shuttingDown = false;
function shutdown(signal: NodeJS.Signals): void {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down.`);

  server.close((error) => {
    if (error !== undefined) {
      console.error("HTTP server shutdown failed.", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
