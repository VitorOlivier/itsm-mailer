require("dotenv").config();
const scraper = require("./scraper.js");

async function startup() {
  console.log(`Starting application ${new Date()}`);

  try {
    console.log("Initializing scraper module");

    await scraper.initialize(shutdown);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startup();

async function shutdown(e) {
  let err = e;

  console.log("Shutting down application ");

  try {
    console.log("Closing scraper module");
    scraper.shutdown();
  } catch (e) {
    console.error(e);
    err = err || e;
  }

  console.log(`Exiting application ${new Date()}`);

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM");

  await shutdown();
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT");

  await shutdown();
});

process.on("uncaughtException", async (err) => {
  console.log("Uncaught exception");
  console.error(err);

  await shutdown(err);
});
