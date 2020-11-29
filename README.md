# itsm-mailer

> ITSM Mailer is a application developer in Node.js to access ITSM site, scrape data and send e-mail. ITSM Mailer runs [Puppeteer](https://github.com/GoogleChrome/puppeteer) to scraper and [Nodemailer](https://github.com/nodemailer/nodemailer) to send e-mail.

## Getting Started

### Installation

```bash
git clone https://github.com/VitorOlivier/itsm-mailer
cd sef-monitor
npm i
```

### Create file .env to set environment variable
```bash
NODE_HTTP_PROXY=<URL_PROXY>
NODE_ITSM_PWD=<PASSWORD_TO_ACESS_ITSM_PORTAL>
NODE_ITSM_USER=<USER_NAME_TO_ACESS_ITSM_PORTAL>
NODE_MAIL_PWD=<PASSWORD_TO_SEND_MAIL>
NODE_MAIL_USER=<USER_NAME_TO_SEND_MAIL>
```

### Usage
In the project directory, you can run:

```bash
npm start
```
