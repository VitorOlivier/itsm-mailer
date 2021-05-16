const result = require("dotenv").config();
module.exports = {  
  updateData: {url: "http://localhost:3000/update-data", jobConfig: "0 55 7 * * 1",},
  sendMail: {url: "http://localhost:3000/send-mail", jobConfig: "0 0 8 * * 1",},
  };
  