const nodemailer = require("nodemailer");
const config = require("./config/mailer.js");
module.exports.sendMail = async (dados) => {
  if (!(dados.length == 0)) {
    let html;
    html += `<h1 style="color: #5e9ca0;">Novos Anúncios!</h1>`;
    /*
    html += `<ol style="list-style: none; font-size: 14px; line-height: 32px; font-weight: bold;">`;
    dados.forEach((d) => {
      html += `<li style="clear: both;"><h2 style="color: #2e6c80;"><a href="${d.url}">${d.local}: ${d.descricao} <br> <img src="${d.img}" width="600" border: 1px solid #5e9ca0;></a></h2</li>`;
    });
    html += `</ol>`;
    */
    const mail = nodemailer.createTransport(config.transport);
    config.mailOptions.hmtl = html;

    mail.sendMail(config.mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
