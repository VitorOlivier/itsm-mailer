const logger = require("../controller/logger");
const path = require('path');
const config = require("../config/web-server.js");
const express = require("express");
const cors = require("cors");
const scraper = require("../controller/scraper.js");
const mailer = require("../controller/mailer.js");
const ejs = require("ejs");
const app = express();

let server = {};

module.exports.initialize = async () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.set("view engine", "ejs");

  app.get("/preview", async (req, res) => {
    const tickets = await scraper.getData();
    await scraper.createImageCharts();
    const imagePath = '.\\img\\charts.png';    
    res.render(path.join(__dirname, "..", "views", "mail"), { tickets, imagePath });
  });

  app.get("/charts", async (req, res) => {
    const tickets = await scraper.getData();

    let countPorOrigem = {};
    tickets.forEach((i) => { countPorOrigem[i.origemPedido] = ++countPorOrigem[i.origemPedido] || 1 });
    const ticketsPorOrigem = Object.entries(countPorOrigem).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });

    let countPorRecurso = {};
    tickets.forEach((i) => { countPorRecurso[i.recursoAtribuido] = ++countPorRecurso[i.recursoAtribuido] || 1 });
    const ticketsPorRecurso = Object.entries(countPorRecurso).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });
    let sumIdadePorRecurso = {};
    tickets.forEach((i) => {
      if (sumIdadePorRecurso[i.recursoAtribuido]) {
        sumIdadePorRecurso[i.recursoAtribuido] += i.idade;
      } else {
        sumIdadePorRecurso[i.recursoAtribuido] = i.idade;
      }
    });
    const IdadePorRecurso = Object.entries(sumIdadePorRecurso).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });

    let sumDiasParadoPorRecurso = {};
    tickets.forEach((i) => {
      if (sumDiasParadoPorRecurso[i.recursoAtribuido]) {
        sumDiasParadoPorRecurso[i.recursoAtribuido] += i.diasParado;
      } else {
        sumDiasParadoPorRecurso[i.recursoAtribuido] = i.diasParado;
      }
    });
    const diasParadoPorRecurso = Object.entries(sumDiasParadoPorRecurso).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    });
    res.render(path.join(__dirname, "..", "views", "charts"), { ticketsPorOrigem, ticketsPorRecurso, IdadePorRecurso, diasParadoPorRecurso });
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
    return res.send(scraper.dataScraped);
  });

  app.get("/send-mail", async (req, res) => {
    const tickets = await scraper.getData();
    if (!tickets) {
      return res.send("Erro: Dados de raspagem não disponivel.");
    }
    await scraper.createImageCharts();
    const imagePath = "cid:charts@image.png";
    res.render(path.join(__dirname, "..", "views", "mail"), { tickets, imagePath }, async (err, html) => {
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