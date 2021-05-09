const result = require("dotenv").config();
module.exports = {  
  //jobConfig: "0 0 8 * * 1",
  updateData: {url: "http://localhost:3000/update-data", jobConfig: "42 * * * *",},
  sendMail: {url: "http://localhost:3000/send-mail", jobConfig: "47 * * * *",},
  };
  