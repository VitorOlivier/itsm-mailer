const logger = require("../controller/logger");
const config = require("../config/scheduler.js");
const scheduler = require("node-schedule");
const scraper = require("../controller/scraper.js");
const mailer = require("../controller/mailer.js");

const jobs = [];

module.exports.initialize = async () => {
  const action = async (fireDate) => {
    logger.info("Start Date: " + fireDate); 
    await scraper.initialize(); 
    if (!scraper.dataScraped) {
      logger.error("Erro: Dados de raspagem não disponivel.");
    }
    const filePath = path.join(__dirname,"..","view", "mail.ejs")
    const tickets = scraper.dataScraped;
    ejs.renderFile(filePath, { tickets }, async (err, html) => {
        if(err) {
          logger.error('Erro na leitura do arquivo. '+ err)
        }
        await mailer.sendMail(html)
        logger.info("e-mail enviado com sucesso.")
    })
    logger.info("End Date: " + new Date());
  };  
  //Schedule
  jobs.push(scheduler.scheduleJob(config.jobConfig, action));
};

module.exports.close = async () => {
  jobs.forEach((job) => job.cancel());
};
