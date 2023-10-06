require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 
const fs = require('fs');


module.exports = {

    data: new SlashCommandBuilder()
		.setName('liststaff')
		.setDescription('List all staff for emc.')
        .addStringOption(option => option.setName('role')
            .setDescription("Role.")
            .setRequired(false)
            .addChoices(
                {name:'Admin', value:'admin'},
                {name:'Developer', value:'developer'},
                {name:'Staffmanager', value:'staffmanager'},
                {name:'Moderator', value:'mod'},
                {name:'Helper', value:'helper'},
        )),     

    async execute(interaction) {

        const roleChoice = interaction.options.getString("role");
    
        try {

            fs.readFile('data/staffList.json', 'utf8', async (err, data) => {
                //If an error occours
                if (err) {
                    console.error(err);
                    const embedUser = new EmbedBuilder()
                        .setColor('#c9372c')
                        .setTitle("Error...")
                        .setDescription('Error occored fetching staff.')
                        .setTimestamp()
                        .setFooter({
                            text:'EMCHub : nomad_sky', 
                        });
                    interaction.reply({ embeds:[embedUser] });    
                    return;
                }
              
                const jsonData = JSON.parse(data);
                console.log(jsonData);

                //List of the different roles
                const adminList = await jsonData['admin'].map((item) => item).join("\r\n");
                const devList   = await jsonData['developer'].map((item) => item).join("\r\n");
                const staffMList = await jsonData['staffmanager'].map((item) => item).join("\r\n");
                const modList    = await jsonData['mod'].map((item) => item).join("\r\n");
                const helperList = await jsonData['helper'].map((item) => item).join("\r\n");

                //If there's an desiredrole this will run
                const desiredRole = jsonData[roleChoice];
                desiredRole ? console.log("ROLE : " + desiredRole) : console.log("role not found.");
                
                //Check if the desiredlist
                // const desiredList = null ? console.log("not used") : await jsonData[roleChoice].map((item) => item).join("\r\n");
                const desiredList = roleChoice ? await jsonData[roleChoice].map((item) => item).join("\r\n") : null;
            
                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle("EMC Staff")
                    //Check if theres an desired role, otherwise print all of them
                    if (desiredList != null) {
                        embedUser.addFields(
                            { name: roleChoice, value: '```'+desiredList+'```', inline: true},
                        )
                        .setTimestamp()
                        .setFooter({
                            text:'EMCHub : nomad#1418',
                        });
                    } else {
                        embedUser.addFields(
                            { name: 'Admin', value: '```'+adminList+'```', inline: true},
                            { name: 'Developer', value: '```'+devList+'```', inline: true},
                            { name: 'Staffmanager', value: '```'+staffMList+'```', inline: true},
                            { name: 'Moderator', value: '```'+modList+'```', inline: true},
                            { name: 'Helper', value: '```'+helperList+'```', inline: true},
                        )
                        .setTimestamp()
                        .setFooter({
                            text:'EMCHub : nomad#1418',
                        });
                    }
                    
                //Main message return, returns the embed as well as the buttons for it
                await interaction.reply({ embeds:[embedUser] });    

            });

        } catch(error) {
            console.log(error);
            const embedUser = new EmbedBuilder()
                .setColor('#c9372c')
                .setTitle("Error...")
                .setDescription('Error occored writing command.')
                .setTimestamp()
                .setFooter({
                    text:'EMCHub : nomad#1418', 
                    // iconURL:'https://i.imgur.com/a/bEJlKRY.png'
                });
            interaction.reply({ embeds:[embedUser] });    
        }

    }

}