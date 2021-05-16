const result = require("dotenv").config();
module.exports = {
    httpProxy: process.env.NODE_HTTP_PROXY,
    puppeteerLaunchOptions: {
      headless: true,
      defaultViewport: null,
      args: ["--start-maximized","--lang=pt-PT,pt"],
    },
    url: "https://itsm-webp.glb.besp.dsp.gbes/arsys/forms/itsm-appp.glb.besp.dsp.gbes/SHR%3ALandingConsole/Default+Administrator+View",
    urlLogin: "https://itsm-rssop.glb.besp.dsp.gbes/rsso/start",   
    user: process.env.NODE_ITSM_USER || "IRGUSER",
    pwd: process.env.NODE_ITSM_PWD || "password",
    selectorInputUser: "#user_login",
    selectorInputPwd: "#login_user_password",
    selectorBtnLogin : "#login-jsp-btn",
    selectorBaseTable : ".PageBodyVertical .TableInner .BaseTable",
    selectorBaseTableHrd : ".PageBodyVertical .TableInner .BaseTable tr th",
    selectorBaseTableLines : ".PageBodyVertical .TableInner .BaseTable tr[tabindex='0']",
    selectorBtnLogout : "#WIN_0_300000044",
    selectorLastInteraction : ".ardbnz2PL_03 .TableInner .BaseTable .SelPrimary td:nth-child(4) span"
  };
  