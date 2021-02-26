const logger = require("../controller/logger");
const path = require('path');
const config = require("../config/web-server.js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const scraper = require("../controller/scraper.js");
const mailer = require("../controller/mailer.js");
const ejs = require("ejs");

const app = express();
let server = {};

module.exports.initialize = async () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/preview", async (req, res) => {
    const filePath = path.join(__dirname,"..","view", "mail.ejs")
    tickets = scraper.dataScraped;
    ejs.renderFile(filePath, { tickets }, (err, html) => {
        if(err) {
            return res.send('Erro na leitura do arquivo. '+ err)
        }
        return res.send(html)
    })
  });

  app.get("/get-data", async (req, res) => {
    await scraper.initialize();
    if (!scraper.dataScraped) {
      return res.send("Erro raspagem");
    }
    return res.send(scraper.dataScraped)
  });

  app.get("/send-mail", async (req, res) => {    
    if (!scraper.dataScraped) {
      return res.send("Erro: Dados de raspagem não disponivel.");
    }
    const filePath = path.join(__dirname,"..","view", "mail.ejs")
    const tickets = scraper.dataScraped;
    ejs.renderFile(filePath, { tickets }, async (err, html) => {
        if(err) {
            return res.send('Erro na leitura do arquivo. '+ err)
        }
        await mailer.sendMail(html)
        return res.send("e-mail enviado com sucesso.")
    })
  });

  server = app.listen(config.port, () => {
    logger.info(`ITSM-Mailer Web server listening on :${config.port}`);
  });
};

module.exports.close = async () => {
  server.close((err) => {
    if (err) {
      logger.error(err);
    }
  });
};