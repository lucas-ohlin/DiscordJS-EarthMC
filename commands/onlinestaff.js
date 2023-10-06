require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);


module.exports = {

    data: new SlashCommandBuilder()
		.setName('onlinestaff')
		.setDescription('All staff currently online.'),

    async execute(interaction) {
        
        try {
            //We read the file async
            readFileAsync('data/staffList.json', 'utf8')
                .then(async (data) => {

                    const jsonData = JSON.parse(data);
                    // console.log(jsonData);
            
                    const combinedArray = [];
                    const onlineArray = [];
                    //Remove the colouring format from the json file
                    //and then add the staff members to a combined list
                    for (const key in jsonData) {
                        if (jsonData.hasOwnProperty(key)) {
                            const items = jsonData[key];
                            const remainingItems = items.slice(1);
                            combinedArray.push(...remainingItems);
                        }
                    }
        
                    for (const item of combinedArray) {
                        try {
                            const res = await axios.get(`https://api.earthmc.net/v1/aurora/residents/${item}`);
                            if (res.data['status']['isOnline'] === true) {
                                onlineArray.push(item);
                            }
                            // console.log(res.data);
                        } catch (error) {
                            console.log(error);
                        }
                    }
            
                    const embedUser = new EmbedBuilder()
                        .setColor('#2596be')
                        .setTitle("Online Staffmembers")
                        if (onlineArray != null) {
                            const onlineList = onlineArray.join('\n');
                            embedUser.setDescription(
                                '```'+onlineList+'```'
                            )
                            .setTimestamp()
                            .setFooter({
                                text:'EMCHub : nomad#1418',
                            });
                        } else {
                            embedUser.setDescription(
                                '**No online staff at the moment.**'+'\n'+
                                '*Still need help? make a ticket here : *'+'\n'+
                                'https://discord.gg/mgum6Zw7Ay'
                            )
                            .setTimestamp()
                            .setFooter({
                                text:'EMCHub : nomad_sky',
                            });
                        }
                    
                    await interaction.deferReply();    
                    await interaction.reply({ embeds: [embedUser] });        
                })
                .catch((err) => {
                    console.error(err);
                    const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle("Error...")
                    .setDescription('Error occurred fetching staff.')
                    .setTimestamp()
                    .setFooter({
                        text: 'EMCHub : nomad_sky',
                    });
                    interaction.reply({ embeds: [embedUser] });
                });
          
        } catch (error) {
            console.log(error);
            const embedUser = new EmbedBuilder()
            .setColor('#c9372c')
            .setTitle("Error...")
            .setDescription('Error occurred writing command.')
            .setTimestamp()
            .setFooter({
                text: 'EMCHub : nomad_sky',
            });
            interaction.reply({ embeds: [embedUser] });
        }

    }

}