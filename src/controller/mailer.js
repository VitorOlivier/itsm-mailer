const logger = require("../controller/logger");
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
      subject: config.mailOptions.subject, 
      html: html, 
    }).catch(logger.error);

    logger.info("Message sent: %s", info.messageId);
  } 
};