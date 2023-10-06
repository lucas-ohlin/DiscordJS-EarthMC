require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 

module.exports = {

    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all commands.'), 
     
    async execute(interaction) {

        try {

            const embedUser = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle("EMCHub Commands")
                .setDescription(
                    '**Player**' + '\n' +
                    '`/townless` - Display currently online townless players' + '\n' +
                    '`/position (player)` - Position of the player provided.' + '\n' +
                    '`/resident (player)` - Display information about the player.' + '\n' +
                    '\n' +
                    '**Naiton**' + '\n' +
                    '`/nation (nation)` - Display information about the nation.' + '\n' +
                    '`/invitable (nation)` - Nationless towns close to nation.' + '\n' +
                    '\n' +
                    '**Town**' + '\n' +
                    '`/town (town)` - Display information about the town.' + '\n' +
                    '`/joinable (nation)` - Nations that the given town can join.' + '\n' +
                    '\n' +
                    '**Staff**' + '\n' +
                    '`/onlinestaff` - All staff currently online.' + '\n'   +
                    '`/liststaff` - List all staff for emc.' + '\n' + 
                    '`/liststaff (role)` - List staff with certain role.' + '\n' +
                    '\n' +
                    '**Premium**' + '\n' +
                    '`/newday` - Display all towns about to fall.' + '\n' 
                )
                .setTimestamp()
                .setFooter({
                    text:'EMCHub : nomad#1418', 
                });
                
            interaction.reply({ embeds:[embedUser] });    

        } catch(error) {
            console.log(error);
            const embedUser = new EmbedBuilder()
                .setColor('#c9372c')
                .setTitle("Error...")
                .setDescription('An Error Occoured.')
                .setTimestamp()
                .setFooter({
                    text:'EMCHub : nomad#1418', 
                });
            interaction.reply({ embeds:[embedUser] });    
        }

    }

}