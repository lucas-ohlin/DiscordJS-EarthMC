require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('position')
		.setDescription('Position of the player provided.')
        .addStringOption(option => option.setName('player')
            .setDescription("Player name.")
            .setRequired(true)),   

    async execute(interaction) {

        const playerName = interaction.options.getString("player");

        try {

            //EMC's official API
            axios.get(`https://emctoolkit.vercel.app/api/aurora/onlineplayers`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then((res) => {       
                
                console.log(res['data']);

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

                //Check if the player is online / exists
                if (player != undefined) {

                    const embedUser = new EmbedBuilder()
                        .setColor('#2596be')
                        .setTitle(`Position `+'`'+`${playerName}`+'`')
                        if (mining === true) {
                            embedUser.setDescription(
                                '**Hidden From The Map**\nUnderground, Shifting or Invisible.'
                            )
                            .setTimestamp()
                            .setFooter({
                                text:'EMCHub : nomad_sky', 
                                //url
                            });
                        } else {
                            embedUser.addFields(
                                { name: 'Coords', value: `X: ${posX} \nY: ${posY} \nZ: ${posZ}`, inline: true},
                                { name: 'Dynmap Link', value: `[${posX} ${posZ}](https://earthmc.net/map/aurora/?worldname=earth&mapname=flat&zoom=6&x=${posX}&z=${posZ})`},
                            )
                            .setTimestamp()
                            .setFooter({
                                text:'EMCHub : nomad_sky', 
                            });
                        }
                        
                    interaction.reply({ embeds:[embedUser] });

                } 
                //player is not online or does not exist
                else {
                    const embedUser = new EmbedBuilder()
                        .setColor('#c9372c')
                        .setTitle("Error...")
                        .setDescription(`**${playerName}** is not online or does not exist.\nNames are case sensitive.`)
                        .setTimestamp()
                        .setFooter({
                            text:'EMCHub : nomad_sky', 
                        });
                    interaction.reply({ embeds:[embedUser] });    
                }

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