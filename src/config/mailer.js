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
      from: process.env.ITSM_MAILER_MAIL_OPTIONS_FROM ,
      to: process.env.ITSM_MAILER_MAIL_OPTIONS_TO,
      cc: process.env.ITSM_MAILER_MAIL_OPTIONS_CC,
      bcc: process.env.ITSM_MAILER_MAIL_OPTIONS_BCC,
      subject: process.env.ITSM_MAILER_MAIL_OPTIONS_SUBJECT || "Tickets Pendentes - " 
    },
  };