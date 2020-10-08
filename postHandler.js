const Discord = require('discord.js');

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');
  
async function AcceptUser(data, member) {
    const giveRoles = [];
    giveRoles.push('Verified');
    giveRoles.push(`${data.Q3} Student`);

    if (data.Q6) {
      for (let i = 0; i < data.Q6.length; i++) {
        giveRoles.push(data.Q6[i]);
      };
    };

    for (let i = 0; i < data.Q5.length; i++) {
      giveRoles.push(data.Q5[i]);
    };

    for (let i = 0; i < giveRoles.length; i++) {
      giveRoles[i] = await member.guild.roles.cache.find(role => role.name === giveRoles[i]);
      await member.roles.add(`${giveRoles[i].id}`);
      
      if (i == (giveRoles.length-1)) {
        await member.setNickname(data.Q1); 
      }''
    };
};

async function DeclineUser(member) {
    await member.user.send('Our team has rejected your verification request. Please submit a new request.')
      .catch(console.error);
};

async function AddRow(data) {
  const doc = new GoogleSpreadsheet('1CFbXkv6bXd8-evYZxxeT1uXJ6suk74qV6K9y3ZgngXU');
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();

  const sheetData = doc.sheetsByTitle['Copy of Verification Data'];
  
  const row = await sheetData.addRow({
    'Timestamp': `${data.Timestamp}`,
    'Name': `${data.Q1}`,
    'Discord Username': `${data.Q2}`,
    'School': `${data.Q3} Student`,
    'Grade': `${data.Q4}`,
    'Classes': `${FindRoles(data.Q5, true)}`,
    'Roles': `${FindRoles(data.Q6, true)}`,
    'Status': `Pending`,
  });
  
  return row.rowIndex;
};

async function UpdateRow(row, status, admin) {
  const doc = new GoogleSpreadsheet('1CFbXkv6bXd8-evYZxxeT1uXJ6suk74qV6K9y3ZgngXU');
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle['Copy of Verification Data'];
  await sheet.loadCells();

  const cellStatus = sheet.getCellByA1(`H${row}`);
  cellStatus.value = `${status}`;

  const cellAdmin = sheet.getCellByA1(`I${row}`);
  cellAdmin.value = `${admin}`;

  await cellStatus.save();
  await cellAdmin.save();
};

function FilterUser(user) {
  if (user === undefined) {
    return false;
  } else {
    return true;
  }
};

function FilterName(name) {
  if(name.indexOf(' ') >= 0){
    lastname = name.charAt(name.indexOf(' ')+1).toUpperCase() + '.';
    firstname = name.substring(0, name.indexOf(' ')+1);
    firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1) 
    name = firstname + lastname;

    return name;
  } else {
    return false;
  }
};

function FindRoles(array, comma) {
    let roles;

    for (let role of array) {
        if (roles !== undefined) {
          if (comma) {
            roles = `${roles}, ${role}`
          } else {
            roles = `${roles}\n${role}`;
          };         
        } else {
          roles = `${role}`;
        };
    };
    return roles;
};

async function postHandler (req, res, Client) {
  console.log(`HTTP POST REQUEST\nstatusCode: ${res.statusCode}`);
  res.redirect('http://localhost:3000/index.html');

  const data = req.body;
  const channel = await Client.channels.cache.get('741549843792527360');
  await channel.guild.members.fetch();
  const user = await Client.users.cache.find(user => user.tag == data.Q2);
  const member = await channel.guild.members.cache.get(user.id);
  const name = FilterName(data.Q1);

  if (FilterUser(user) === false && name === false ) {
    const LogEmbed = new Discord.MessageEmbed()
      .setColor('#ff470f')
      .setDescription(`<:smooth_cross:762482293847490561> **${data.Q2} was not found and ${data.Q1} is not a valid name**`);
    channel.send(LogEmbed);
  } else if (FilterUser(user) === false) {
    const LogEmbed = new Discord.MessageEmbed()
      .setColor('#ff470f')
      .setDescription(`<:smooth_cross:762482293847490561> **${data.Q2} was not found**`);
    channel.send(LogEmbed);
  } else if (name === false) {
    const LogEmbed = new Discord.MessageEmbed()
      .setColor('#ff470f')
      .setDescription(`<:smooth_cross:762482293847490561> **${data.Q1} is not a valid name**`);
    channel.send(LogEmbed);
  } else {
    const RequestEmbed = new Discord.MessageEmbed()
      .setColor('#4A90E2')
      .setTitle('Verification Request')
      .setAuthor(user.tag, user.displayAvatarURL())
      .setDescription(`User: **<@!${user.id}>**\nName: **${name}**\nStatus: **Pending**`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        {name: 'School', value: `${data.Q3} Student\n${data.Q4}\n${FindRoles(data.Q5, false)}`, inline: true},
        {name: 'Roles', value: `${FindRoles(data.Q6, false)}`, inline: true}
      )
      .setTimestamp()
      .setFooter('Property of Original People™');
    const row = await AddRow(data);
    const message = await channel.send(RequestEmbed);
    await message.react('755585504057229504') //Smooth checkmark
      .catch(console.error);
    await message.react('762482293847490561') //Smooth cross
      .catch(console.error);

    let filter = (reaction, admin) => {
      if (reaction.emoji.name == 'smooth_checkmark') {
        RequestEmbed
            .setColor('#43b581')
            .setDescription(`User: **<@!${user.id}>**\nName: **${name}**\nStatus: **Accepted by <@${admin.id}>**`);
        AcceptUser(data, member);
        UpdateRow(row, 'Accepted', admin.tag);
        message.reactions.removeAll()
          .catch(console.error);
        message.edit(RequestEmbed); 
      } else if (reaction.emoji.name == 'smooth_cross') {
        RequestEmbed
          .setColor('#ff470f')
          .setDescription(`User: **<@!${user.id}>**\nName: **${name}**\nStatus: **Declined by <@${admin.id}>**`);
        DeclineUser(member);
        UpdateRow(row, 'Declined', admin.tag);
        message.reactions.removeAll()
          .catch(console.error);
        message.edit(RequestEmbed);
      };
    };
    message.awaitReactions(filter);
  };
};

module.exports = postHandler;