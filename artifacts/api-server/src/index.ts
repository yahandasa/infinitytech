import app from "./app";
import { logger } from "./lib/logger";
import { ensureProjectsTable } from "./lib/setup-supabase-schema";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Bootstrap Supabase schema on startup (no-op if table already exists)
ensureProjectsTable().catch(e => logger.warn({ err: e }, "Schema bootstrap warning"));

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
