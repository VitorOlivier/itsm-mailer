const logger = require("../controller/logger");
const path = require('path');
const config = require("../config/scraper.js");
const puppeteer = require("puppeteer");
let outputData = [];
let runId=0;
let statusCode =0; //0 = standby; 1 = runnig; 2 = error;
let startDate;
let endDate;
let error;

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

const scrapeITSM =  async () => {  
  let data = [];
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
  //Login  
  if (page.url().includes(config.urlLogin)) {
      await page.type(config.selectorInputUser,config.user);
      await page.type(config.selectorInputPwd,config.pwd);
      await Promise.all([
          page.waitForNavigation(),
          page.click(config.selectorBtnLogin),
        ]);                 
  }      
  //Raspando pagina principal
  await page.waitForSelector(config.selectorBaseTable)
    .catch(async () => {
      await page.waitForSelector("#DivTable tbody tr:nth-child(2) td iframe")
        .then(async () => {
          logger.error("Nenhuma sessão disponivel, tentar novamente mais tarde.")
          await Promise.all([
            page.waitForNavigation(),
            page.click(config.selectorBtnLogout),
          ]);            
          await page.close();
          await browser.close();   
        })
        .catch(err => logger.error("Não encontrado nenhuma msg, possivelmente site não está respondendo."));   
    });
  const outputs = await page.$$eval(config.selectorBaseTableLines, elements => elements.map(e => {
      const output = [];
      [...e.getElementsByTagName("span")].forEach(subE => output.push(subE.innerText.trim()));
      return output;
  }));    
  //Raspando pagina de detalhe
  const elementsHandle = await page.$$(".PageBodyVertical .TableInner .BaseTable tr td:nth-child(10)");
  const detOutput = [];
  for (const eH of elementsHandle) {           
    await eH.click({clickCount: 2});
    await page.waitForTimeout(2000);
    await page.waitForSelector(".StackPanel[arvisibility='visible'][class*=ardbnz2PL_0] .SelPrimary td:nth-child(4) span",)
      .then(async () => {
        const dtUltimaInteracao = await page.$eval(".StackPanel[arvisibility='visible'][class*=ardbnz2PL_0] .SelPrimary td:nth-child(4) span", el => el.textContent);
        const origemPedido = await page.$eval(".StackPanel[arvisibility='visible'][class*=ardbnz2PL_0] div[ardbn='ESI_Panel_Ambiente'] .pnl div[ardbn='ESI_NomeEstrutura'] textarea", el => el.value);
        const origemPedidoUsuario = await page.$eval(".StackPanel[arvisibility='visible'][class*=ardbnz2PL_0] .pnl div[ardbn='Customer'] textarea", el => el.value);          
        detOutput.push({dtUltimaInteracao,origemPedido,origemPedidoUsuario});        
      })
      .catch(err => {
        detOutput.push({});
        logger.error(err);
      });      
    await page.waitForSelector(".btnimgdiv img[title='Home']")
      .then(async () => {
        await page.$eval(".btnimgdiv img[title='Home']", el => el.click());
      }) 
      .catch(err => logger.error("Não encontrado botao home, possivelmente não existe."));         
    await page.waitForTimeout(2000);             
  };      

  await Promise.all([
      page.waitForNavigation(),
      page.click(config.selectorBtnLogout),
    ]);
  
  await page.close();
  await browser.close();   
  //Tratanto dados raspados
  for (var i = 0; i < outputs.length; i++) {
    if (!outputs[i][1].includes("TAS")) {
      const id = outputs[i][1]; 
      const ambiente = ( outputs[i][0] ? outputs[i][0] : "Produção" ) ;
      const grupoAtribuido = outputs[i][10];
      const recursoAtribuido = outputs[i][11];      
      const dtAbertura = stringToDate(outputs[i][2].split(" ")[0],"mm/dd/yyyy","/"); 
      const dataAbertura = dtAbertura.toISOString().split("T")[0];  
      const now = new Date();
      const diffAbertura = Math.abs(now.getTime() - dtAbertura.getTime()); // Subtrai uma data pela outra
      const idade = Math.ceil(diffAbertura / (1000 * 60 * 60 * 24));
      const dtUltimaInteracao = stringToDate(detOutput[i].dtUltimaInteracao.split(" ")[0],"mm/dd/yyyy","/"); 
      const ultimaInteracao = dtUltimaInteracao.toISOString().split("T")[0];
      const diffUltimaInteracao = Math.abs(now.getTime() - dtUltimaInteracao.getTime()); // Subtrai uma data pela outra
      const diasParado = Math.ceil(diffUltimaInteracao / (1000 * 60 * 60 * 24));
              
      let origemEquipa = "";
      let origemPedido = "";
      if (outputs[i][14] == "DIS.RiscoReporting") {
        origemEquipa = "ü";  
        origemPedido = "DSI-RG-" + detOutput[i].origemPedidoUsuario;
      } else {
        origemPedido = detOutput[i].origemPedido;
      }     
      let status = "";
      let statusStyle = "";
      if (idade >= 7 && idade < 10) {
        status = "±";
        statusStyle = "td-status-gray";
      } else if (idade >= 10 && idade < 14) {
        status = "±±";
        statusStyle = "td-status-gray";
      } else if (idade >= 14 && idade < 21) {
        status = "Â";
        statusStyle = "td-status-blue";
      } else if (idade >= 21 && idade < 30) {
        status = "ÂÂ";
        statusStyle = "td-status-blue";
      } else if (idade >= 30 && idade < 45) {
        status = "M";
        statusStyle = "td-status-brown";
      } else if (idade >= 45 && idade < 60) {
        status = "MM";  
        statusStyle = "td-status-brown";
      } else if (idade >= 60 && idade < 90) {
        status = "N";
        statusStyle = "td-status-red";
      } else if (idade >= 90 && idade < 180) {
        status = "NN";
        statusStyle = "td-status-red";
      } else if (idade >= 180 && idade < 365) {
        status = "x";    
        statusStyle = "td-status-red2";
      } else if (idade >= 365) {
        status = "xx";
        statusStyle = "td-status-red2";
      }
      data.push({status,statusStyle,id,ambiente,grupoAtribuido,recursoAtribuido,dataAbertura,idade,ultimaInteracao,diasParado,origemPedido,origemEquipa});
    }       
  };   
  const sortedData = data.sort((a,b) => {
    if (a.idade > b.idade) {
      return -1;
    }
    if (a.idade < b.idade) {
      return 1;
    }
    return 0;
  });  
  return sortedData;
}

module.exports.initialize = async () => {  
  if (statusCode == 1) {
    return runId;
  } else {
    runId = Math.floor(Math.random() * 101); 
    statusCode = 1;
    error = '';
    startDate = new Date();
    endDate = '';
    scrapeITSM()
    .then((data) => {
      statusCode = 0;
      error = '';
      endDate = new Date(); 
      outputData = data;    
    })
    .catch((e)=>{
      logger.error(JSON.stringify(e));
      statusCode = 2;
      error = e;      
      endDate = new Date();
    });     
    return runId;
  }
   
};

module.exports.createImageCharts = async () => {
  const browser = await puppeteer.launch({headless: false});  
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 800,
    isMobile: false
  })  
  await page.goto("http://localhost:3000/charts", {waitUntil: 'networkidle2'});
 
  const elt = await page.$('.tab-graficos');
  await elt.screenshot({path: path.join(__dirname,"..","public","img","charts.png")});
  await browser.close();
};  

module.exports.status = async () => {
  return {runId,statusCode,startDate,endDate,error};
};

module.exports.getData = async () => {
  return outputData;
};
