const webServer = require("./service/server.js");
const scheduler = require("./service/scheduler.js");
const logger = require("./controller/logger");
async function startup() {
  logger.info(`Starting application ${new Date()}`);
  try {
    logger.info("Initializing web server module");
    await webServer.initialize();
    logger.info("Initializing scheduler module");
    await scheduler.initialize();    
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

startup();

async function shutdown(e) {
  let err = e;

  logger.info("Shutting down application ");

  try {
    logger.info("Closing scheduler module");
    webServer.close();
    logger.info("Closing web server module");
    scheduler.close();
  } catch (e) {
    logger.error(e);
    err = err || e;
  }

  logger.info(`Exiting application ${new Date()}`);

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM");

  await shutdown();
});

process.on("SIGINT", async () => {
  logger.info("Received SIGINT");

  await shutdown();
});

process.on("uncaughtException", async (err) => {
  logger.info("Uncaught exception");
  logger.error(err);

  await shutdown(err);
});
