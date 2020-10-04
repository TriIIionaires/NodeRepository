const Discord = require('discord.js');
const Client = new Discord.Client();

require('dotenv').config()

const token = process.env.TOKEN;

const http = require('http');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

server.listen(port, '127.0.0.1', () => {
  console.log('Listening at port 3000');
});

/*
Client.once('ready', () => {
  let date = new Date().toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/,'');
  console.log(`${date}: Client is active`);
});

function FindSchool(school) {
  const LIST_SCHOOLS = [
    ['Walker'] = 'Walker Student', ['Kennedy'] = 'Kennedy Student', ['Orangeview'] = 'Orangeview Student', ['Lexington'] = 'Lexington Student',
    ['Ball'] = 'Ball Student', ['Brookhurst'] = 'Brookhurst Student', ['Dale'] = 'Dale Student', ['South'] = 'South Student',
    ['Sycamore'] = 'Sycamore Student', ['Anaheim'] = 'Anaheim Student', ['Cypress'] = 'Cypress Student', ['Gilbert'] = 'Gilbert',
    ['Katella'] = 'Katella Student', ['Loara'] = 'Loara', ['Magnolia'] = 'Magnolia Student', ['Polaris'] = 'Polaris Student',
    ['Savanna'] = 'Savanna Student', ['Western'] = 'Western Student', ['Oxford'] = 'Oxford Student', ['Cambridge'] = 'Cambridge Student', 
    ['Other'] = 'Outsiders'
  ];

  if (LIST_SCHOOLS[school] !== null) {
    return LIST_SCHOOLS[school];
  }; 
};

function FindClasses(array) {
  if (!array[0] == null) {
    if (!array[1] == null) {
      if (!array[2] == null) {
        return `${array[0]}\n${array[1]}\n${array[2]}`;
      };
      return `${array[0]}\n${array[1]}`;
    };
    return `${array[0]}`;
  };
};

function FindRoles(array) {
  if (!array[0] == null) {
    if (!array[1] == null) {
      if (!array[2] == null) {
        if (!array[3] == null) {
          if (!array[4] == null) {
            return `${array[0]}\n${array[1]}\n${array[2]}\n${array[3]}\n${array[4]}`;
          }
          return `${array[0]}\n${array[1]}\n${array[2]}\n${array[3]}`;
        }
        return `${array[0]}\n${array[1]}\n${array[2]}`;
      }
      return `${array[0]}\n${array[1]}`;
    }
    return `${array[0]}`;
  }
}

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.statusCode);

  const data = JSON.parse(req.body);
  const user = Client.users.cache.find()

  const RequestEmbed = new Discord.MessageEmbed()
    .setColor('#4A90E2')
    .setTitle('Verification Request')
    .setAuthor(data.Q2)
    .setDescription(`Nickname: **${data.Q1}**\nStatus: **Pending**`)
    .setThumbnail(data.Q2)
    .addFields(
      {name: 'School', value: `${FindSchool(data.Q3)}\n${FindClasses(data.Q5)}`, inline: true},
      {name: 'Roles', value: `${FindRoles(data.Q5)}`, inline: true}
    )
    .setTimestamp()
    .setFooter('Property of Original People™')

  console.log('HTTP POST received')
});

app.listen(port, () => {
  console.log('Listening');
});

Client.login(token);*/