const result = require("dotenv").config();
module.exports = {
    transport: {
        debug: process.env.ITSM_MAILER_SMTP_DEBUG || true,
        secure: process.env.ITSM_MAILER_SMTP_SECURE || false,  
        host: process.env.ITSM_MAILER_SMTP_HOST || "mail.bes.gbes",
        port: process.env.ITSM_MAILER_SMTP_PORT || "25",        
        proxy: process.env.ITSM_MAILER_HTTP_PROXY        
    },    
    mailOptions: {
      from: process.env.ITSM_MAILER_MAIL_OPTIONS_FROM || "bruno.maia@novobanco.pt",
      to: process.env.ITSM_MAILER_MAIL_OPTIONS_TO || "vitor.olivier.oliveira@novobanco.pt; bruno.maia@novobanco.pt; ana.figueiredo@novobanco.pt;",
      subject: "Tickets Pendentes RG - " + (new Date()).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")
    },
  };