const logger = require("../controller/logger");
const config = require("../config/scheduler.js");
const scheduler = require("node-schedule");
const axios = require('axios');

const jobs = [];

module.exports.initialize = async () => {
  const action1 = async (fireDate) => {
    logger.info("Start Date: " + fireDate); 
    axios.get(config.updateData.url)
      .then(response => {
        console.log(response.data);
        logger.info("End Date: " + new Date());
      })
      .catch(error => {
        logger.info(error);
      });    
  };  
  jobs.push(scheduler.scheduleJob(config.updateData.jobConfig, action1));

  const action2 = async (fireDate) => {
    logger.info("Start Date: " + fireDate); 
    axios.get(config.sendMail.url)
      .then(response => {
        console.log(response.data);
        logger.info("End Date: " + new Date());
      })
      .catch(error => {
        logger.info(error);
      });    
  };  
  jobs.push(scheduler.scheduleJob(config.sendMail.jobConfig, action2));  
};

module.exports.close = async () => {
  jobs.forEach((job) => job.cancel());
};
