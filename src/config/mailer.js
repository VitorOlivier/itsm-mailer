module.exports = {
    transport: {
        debug: true,
        host: process.env.NODE_SMTP_HOST || 'smtp.office365.com',
        //secureConnection: false, 
        port: 465,        
        proxy: process.env.NODE_HTTP_PROXY,
        tls: {
            cipher:'SSLv3',
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.NODE_MAIL_USER || "",
            password: process.env.NODE_MAIL_PWD || "",
      },
    },    
    mailOptions: {
      from: process.env.NODE_MAIL_OPTIONS_FROM || "vitor_neo@hotmail.com",
      to: process.env.NODE_MAIL_OPTIONS_TO || "vitor_neo@hotmail.com",
      subject: "Tickets Pendentes RG",
      html: "",
    }
  };