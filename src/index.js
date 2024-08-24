require('dotenv').config();
const keep_alive = require('./keep_alive');
const {Client, IntentsBitField, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageEmbed} = require("discord.js");
const eventHandler = require('../src/handlers/eventHandler');
const mongoose = require('mongoose');
const { CommandKit } = require('commandkit');
const path = require('path');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.GuildMessagePolls,
        IntentsBitField.Flags.GuildPresences,

    ],
    
});


(async () => {
	try {
		mongoose.connect(process.env.MONGODB_URI);
		console.log('Connected to DB');
		eventHandler(client);
        client.login(process.env.TOKEN);

		
	} catch (error) {
		console.log(`There was an error(index.js): ${error}.`);
	}
})();

/*new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    bulkRegister: true,
});*/





client.on('ready', (c) => {
   

    client.user.setActivity({
        name: "automaze.com | ?help?",
        type: ActivityType.Playing,
    })
});
client.on('messageCreate', message => {
    if (message.content.startsWith('?help?')) {
        message.channel.send('# **Here are all my supported commands:**\n**• /autorole-configure\n• /autorole-disable\n• /balance\n• /ban\n• /daily\n• /kick\n• /timeout\n• /level**');
    }

    
});


/*mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
    client.login(process.env.TOKEN);

});*/


