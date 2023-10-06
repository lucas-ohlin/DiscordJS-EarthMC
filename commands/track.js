require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('track')
        .setDescription('Tracks a player, calls the API each 3s.')
        .addStringOption((option) =>
            option.setName('player')
            .setDescription('Player name.')
            .setRequired(true)),

    async execute(interaction) {
        
        const playerName = interaction.options.getString('player');

        try {

            // Declare embedUser here
            let embedUser;

            // Function to fetch and update player data
            async function fetchAndUpdateData() {
                try {

                    if (!embedUser) {
                        //Defer the bot's reply
                        await interaction.deferReply();
                        embedUser = new EmbedBuilder().setColor('#2596be').setTitle(`Position ` + '`' + `${playerName}` + '`');
                    }
                    
                    const res = await axios.get('https://emctoolkit.vercel.app/api/aurora/onlineplayers', {
                        headers: {
                            'Content-type': 'application/json',
                        },
                    });
                    
                    //Instanciate the vars
                    var players = res.data;
                    var player;
                    var posX;
                    var posY;
                    var posZ;
                    var mining;

                    //Save data from the given player
                    for (var item in players) {
                        if (players[item]['name'] == playerName) {
                            player = players[item]['name'];
                            posX = players[item]['x'];
                            posY = players[item]['y'];
                            posZ = players[item]['z'];
                            mining = players[item]['underground'];
                            break;
                        }
                    }

                    // Update the embedUser with the new data
                    if (mining === true) {
                        embedUser.setDescription(
                            '**Hidden From The Map**\nUnderground, Shifting or Invisible.'
                        )
                        .setTimestamp()
                        .setFooter({
                            text: 'EMCHub : nomad_sky',
                        });
                    } else {
                        embedUser.addFields(
                            { name: 'Coords', value: `X: ${posX} \nY: ${posY} \nZ: ${posZ}`, inline: true},
                            { name: 'Dynmap Link', value: `[${posX} ${posZ}](https://earthmc.net/map/aurora/?worldname=earth&mapname=flat&zoom=6&x=${posX}&z=${posZ})`},
                        )
                        .setTimestamp()
                        .setFooter({
                            text: 'EMCHub : nomad_sky',
                        });
                    }

                    // Edit the deferred reply with the new data
                    await interaction.editReply({ embeds: [embedUser] });

                } catch (err) {
                    console.error('Error : ', err);
                    // Handle errors and reply with an error message
                    embedUser = new EmbedBuilder()
                        .setColor('#c9372c')
                        .setTitle('Error...')
                        .setDescription('Error occurred fetching player.')
                        .setTimestamp()
                        .setFooter({
                            text: 'EMCHub : nomad_sky',
                        });
                    interaction.editReply({ embeds: [embedUser] });
                }
            }

            //Initial data fetch from the function
            await fetchAndUpdateData();

            // Set up a timer to fetch and update data every 3 seconds
            const timer = setInterval(async () => {
                if (!interaction.deferred && !interaction.replied) {
                    //Interaction is no longer active, stop updating
                    clearInterval(timer);
                    return;
                }
                //Call the function
                await fetchAndUpdateData();
            }, 3000);

        } catch (error) {
            console.log(error);
            embedUser = new EmbedBuilder()
                .setColor('#c9372c')
                .setTitle('Error...')
                .setDescription('Error occurred writing command.')
                .setTimestamp()
                .setFooter({
                    text: 'EMCHub : nomad_sky',
                });
            interaction.editReply({ embeds: [embedUser] });
        }
    },
}


