const Discord = require('discord.js');
const Client = new Discord.Client();
require('dotenv').config()

const token = process.env.TOKEN;

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const postHandler = require('./postHandler.js');

function GetDate() {
  let date = new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/,'');
  return date;
};

Client.once('ready', () => {
  console.log(`${GetDate()} Client is active`);
});

Client.login(token);

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.post('/request.html', async function (req, res) {
  postHandler(req, res, Client);
});

app.listen(port, () => {
  console.log(`${GetDate()} Listening on ${port}`);
});