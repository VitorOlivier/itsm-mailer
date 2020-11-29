const config = require("./config/scraper.js");
const mailer = require("./mailer.js");
const puppeteer = require("puppeteer");
let browser = {};

module.exports.initialize = async (shutdown) => {
  browser = await puppeteer.launch(config.puppeteerLaunchOptions);  
  const dataScraped = await itsm(); 
  console.log("dataScraped",dataScraped);
  await mailer.sendMail(dataScraped);
  //await shutdown();
};

module.exports.shutdown = async () => {
    await browser.close();
};

const itsm = async () => {
    const page = await browser.newPage();
    await page.goto(config.url, { waitUntil: "networkidle2" });
      
    if (page.url().includes(config.urlLogin)) {
        await page.type(config.selectorInputUser,config.user);
        await page.type(config.selectorInputPwd,config.pwd);
        await Promise.all([
            page.waitForNavigation(),
            page.click(config.selectorBtnLogin),
          ]);        
    }      
    
    await page.waitForSelector(config.selectorBaseTable);

    const tabHeaders = await page.$$eval(config.selectorBaseTableHrd, elements => elements.map(e => e.textContent));
    const tabLines = await page.$$eval(config.selectorBaseTableLines, elements => elements.map(e => {
        const tabline = [];
        [...e.getElementsByTagName("span")].forEach(col => tabline.push(col.innerText.trim()));
        return tabline;
    }));    

    await Promise.all([
        page.waitForNavigation(),
        page.click(config.selectorBtnLogout),
      ]);
    await page.close();
    await browser.close();  
    return {tabHeaders, tabLines};
};

