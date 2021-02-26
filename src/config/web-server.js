const result = require("dotenv").config();
module.exports = {
    port: process.env.NODE_WS_PORT || 3000
  };