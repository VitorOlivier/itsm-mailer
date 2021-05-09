const result = require("dotenv").config();
module.exports = {  
  //jobConfig: "0 0 8 * * 1",
  updateData: {url: "http://localhost:3000/update-data", jobConfig: "0 0 7 * * 1",},
  sendMail: {url: "http://localhost:3000/send-mail", jobConfig: "0 5 7 * * 1",},
  };
  