const result = require("dotenv").config();
module.exports = {
    transport: {
        debug: process.env.ITSM_MAILER_SMTP_DEBUG || true,
        secure: process.env.ITSM_MAILER_SMTP_SECURE || false,  
        host: process.env.ITSM_MAILER_SMTP_HOST,
        port: process.env.ITSM_MAILER_SMTP_PORT,        
        proxy: process.env.ITSM_MAILER_HTTP_PROXY        
    },    
    mailOptions: {
      from: process.env.ITSM_MAILER_MAIL_OPTIONS_FROM || "vitor.olivier.oliveira@novobanco.pt",
      to: process.env.ITSM_MAILER_MAIL_OPTIONS_TO || "vitor.olivier.oliveira@novobanco.pt",
      subject: "Tickets Pendentes RG"
    },
  };