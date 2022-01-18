const logger = require("../controller/logger");
const path = require('path');
const config = require("../config/web-server.js");
const express = require("express");
const cors = require("cors");
const scraper = require("../controller/scraper.js");
const mailer = require("../controller/mailer.js");
const oracle = require("../controller/oracle.js");
const ejs = require("ejs");
const app = express();

let server = {};

module.exports.initialize = async () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.set("view engine", "ejs");

  app.get("/preview-ITSM", async (req, res) => {
    const tickets = await scraper.getData();
    const status = await scraper.status();    
    const imagePath = '.\\img\\charts.png';    
    res.render(path.join(__dirname, "..", "views", "mail"), { tickets, imagePath, status });
  });

  app.get("/preview-B2CM", async (req, res) => {
    const dadosOracle  = await oracle.getOutputData();
    const status = await oracle.status();      
    res.render(path.join(__dirname, "..", "views", "b2cmRWA"), { dadosOracle , status });
  });

  app.get("/update-data", async (req, res) => {
    const runId = await scraper.initialize();
    return res.status(200).send({ runId });
  });

  app.get("/update-data-status", async (req, res) => {
    const status = await scraper.status();
    return res.status(200).send({ status });
  });

  app.get("/get-data", async (req, res) => {
    return res.status(200).send(await scraper.getData());
  });

  app.get("/send-mail", async (req, res) => {
    const tickets = await scraper.getData();
    if (!tickets) {
      return res.send("Erro: Dados de raspagem não disponivel.");
    }
    const status = await scraper.status();  
    const imagePath = "cid:charts@image.png";
    res.render(path.join(__dirname, "..", "views", "mail"), { tickets, imagePath, status }, async (err, html) => {
      if (err) {
        return res.send('Erro na leitura do arquivo. ' + err)
      }
      await mailer.sendMail(html)
      return res.send("e-mail enviado com sucesso.")
    });
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