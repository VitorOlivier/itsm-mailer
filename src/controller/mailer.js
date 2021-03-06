const logger = require("../controller/logger");
const path = require('path');
const nodemailer = require("nodemailer");
const config = require("../config/mailer.js");
module.exports.sendMail = async (html) => {
  if (html) {
    let transporter = nodemailer.createTransport({
      host: config.transport.host,
      port: config.transport.port,
      secure: config.transport.secure, 
      debug: config.transport.debug,
    });

    let info = await transporter.sendMail({
      from: config.mailOptions.from, 
      to: config.mailOptions.to, 
      cc: config.mailOptions.cc, 
      bcc: config.mailOptions.bcc, 
      subject: config.mailOptions.subject + (new Date()).toLocaleDateString('lt-LT'), 
      html: html, 
      attachments: [{
        filename: 'charts.png',
        path: path.join(__dirname,"..","public","img","charts.png"),
        cid: "charts@image.png"
    }]
    }).catch((error) => {logger.error(error)});
  } 
};