const logger = require("../controller/logger");
const config = require("../config/scraper.js");
const puppeteer = require("puppeteer");
let dataScraped = [];

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

module.exports.initialize = async () => {
  //try {
    const browser = await puppeteer.launch(config.puppeteerLaunchOptions);  
    const page = await browser.newPage();
    
    page.on('dialog', async dialog => {
      const message = dialog.message();
      if (message != ""){
        logger.info("ITSM Dialog:",message);
        await dialog.accept();
      }    
    });
  
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
    const tabLines = await page.$$eval(config.selectorBaseTableLines, elements => elements.map(e => {
        const tabline = [];      
        [...e.getElementsByTagName("span")].forEach(col => tabline.push(col.innerText.trim()));
        return tabline;
    }));    
  
    const elements = await page.$$(".PageBodyVertical .TableInner .BaseTable tr td:nth-child(1)");
    for (const element of elements) {
      await element.click({clickCount: 2});
      await page.waitForSelector(".btnimgdiv img[artxt='Backward']");
      //await page.waitForNavigation();
      await page.click(".btnimgdiv img[artxt='Backward']");
      await page.waitForNavigation();
    }
    await Promise.all([
        page.waitForNavigation(),
        page.click(config.selectorBtnLogout),
      ]);
    
    await page.close();
    await browser.close();   
    
    tabLines.forEach( line => {            
      const id = line[1]; 
      const ambiente = line[0];
      const grupoAtribuido = line[10];
      const recursoAtribuido = line[11];
  
      const dtAbertura = stringToDate(line[2].split(" ")[0],"mm/dd/yyyy","/"); 
      const dataAbertura = dtAbertura.toISOString().split("T")[0];
  
      const now = new Date();
      const diff = Math.abs(now.getTime() - dtAbertura.getTime()); // Subtrai uma data pela outra
      const idade = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
      const ultimaInteracao = now.toISOString().split("T")[0];
      const diasParado = 12;
      const origemPedido = "";
      let origemEquipa = "";
      if (line[14] == "DIS.RiscoReporting") {
        origemEquipa = "ü";  
      }     
      let status = "";
      if (idade <= 10) {
        status = "±";
      } else if (idade <= 15) {
        status = "±±";
      } else if (idade <= 20) {
        status = "Â";
      } else if (idade <= 30) {
        status = "ÂÂ";
      } else if (idade <= 50) {
        status = "M";
      } else if (idade <= 75) {
        status = "MM";  
      } else if (idade <= 100) {
        status = "N";
      } else {
        status = "NN";
      }
      dataScraped.push({status,id,ambiente,grupoAtribuido,recursoAtribuido,dataAbertura,idade,ultimaInteracao,diasParado,origemPedido,origemEquipa});
    });      
  //} catch (error) {
  //  logger.error(error);
  //}
  
 
};

module.exports.dataScraped = dataScraped;