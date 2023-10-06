require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('resident')
		.setDescription('Display information about the player.')
        .addStringOption(option => option.setName('player')
            .setDescription("Player name.")
            .setRequired(true)),   

    async execute(interaction) {

        const playerName = interaction.options.getString("player");

        try {
            //EMC's official API
            axios.get(`https://api.earthmc.net/v2/aurora/residents/${playerName}`, {
                headers: {
                    "Content-type": "Application/json"
                }
            })
            .then((res) => {       

                console.log(res);

                var playerId = res.data['uuid'];
                var onlineStatus = res.data['status']['isOnline'] === false ? "Offline" : "Online";  
                var nationTitle = "Townless"; 
                if (res.data['title'] != null) 
                    nationTitle = res.data['title'] === "" ? "None" : res.data['title'];
                var registeredTime = Math.round(res.data['timestamps']['registered']/1000);
                var lastOnlineTime = Math.round(res.data['timestamps']['lastOnline']/1000);

                var affNation = res.data['nation'] === '' ? "None" : res.data['nation'];
                var affTown = res.data['town'] === '' ? "None" : res.data['town'];

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle(`Resident Info `+'`'+`${playerName}`+'`')
                    .addFields(
                        { name: 'Affiliation', value: `${affNation} **/** ${affTown}`, inline: true},
                        { name: 'Title', value: nationTitle, inline: true},
                        { name: 'Balance', value: `${res.data['stats']['balance']}G`, inline: true },
                        { name: 'Registered', value: '<t:'+registeredTime+'>', inline: true},
                        { name: 'Last Online', value: '<t:'+lastOnlineTime+'>', inline: true }, 
                        { name: 'Status', value: '`'+onlineStatus+'`', inline: true},
                    )
                    .setTimestamp()
                    .setThumbnail(`https://visage.surgeplay.com/head/${playerId}.png`)
                    .setFooter({
                        text:'EMCHub : nomad_sky', 
                    });
                    
                interaction.reply({ embeds:[embedUser] });    

            })
            .catch((err) => {
                console.error('Error : ', err)
                const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle("Error...")
                    .setDescription('Error occored fetching player.')
                    .setTimestamp()
                    .setFooter({
                        text:'EMCHub : nomad_sky', 
                    });
                interaction.reply({ embeds:[embedUser] });    
            })
        } catch(error) {
            console.log(error);
            const embedUser = new EmbedBuilder()
                .setColor('#c9372c')
                .setTitle("Error...")
                .setDescription('Error occored writing command.')
                .setTimestamp()
                .setFooter({
                    text:'EMCHub : nomad_sky', 
                });
            interaction.reply({ embeds:[embedUser] });    
        }

    }

}