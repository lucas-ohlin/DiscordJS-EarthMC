require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('nation')
		.setDescription('Display information about a nation.')
        .addStringOption(option => option.setName('name')
            .setDescription("Nation name.")
            .setRequired(true)),   

    async execute(interaction) {

        const nation = interaction.options.getString("name");

        try {

            //EMC's official API https://api.earthmc.net/v1/aurora/nations/${nation}
            axios.get(`https://api.earthmc.net/v2/aurora/nations/${nation}`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then(async (res) => {       

                console.log(res);
                
                //save the allies to an array
                let allyList = [];
                for (var ally in res.data['allies']) { 
                    allyList.push(ally); 
                }

                //Position of the nation spawn
                var posX = Math.floor(res.data['spawn']['x']);
                var posZ = Math.floor(res.data['spawn']['z']);   

                //Established
                var registeredTime = await Math.round(res.data['timestamps']['registered']/1000);
                
                //Add each town into a list
                const townList = res.data['towns'].map((item) => item).join(', ');
                
                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle(`Nation Info `+'`'+`${nation.charAt(0).toUpperCase() + nation.slice(1)}`+'`')
                    .addFields(
                        { name: 'Leader', value: res.data['king'], inline: true},
                        { name: 'Capital', value: `${res.data['capital']}`, inline: true},
                        { name: 'Residents', value: `${res.data['stats']['numResidents']}`, inline: true},
                        { name: 'Map', value: `[${posX} ${posZ}](https://earthmc.net/map/aurora/?worldname=earth&mapname=flat&zoom=5&x=${posX}&z=${posZ})` , inline: true},
                        { name: 'Nation Claims', value: `${res.data['stats']['numTownBlocks']} (${res.data['stats']['numTownBlocks'] * 16}G)`, inline: true },
                        { name: 'Nation Balance', value: `${res.data['stats']['balance']}G`, inline: true},
                        { name: `Created`, value: `<t:${registeredTime}>`, inline: true},
                        // { name: `Nation Bonus`, value: `<t:${registeredTime}>`},
                        { name: `Towns {${res.data['stats']['numTowns']}}`, value: '```'+`${townList}`+'```'},
                    )
                    .setTimestamp()
                    .setFooter({
                        text:'EMCHub : nomad#1418', 
                    });
                    
                interaction.reply({ embeds:[embedUser] });    

            })
            .catch((err) => {
                console.error('Error : ', err)
                const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle("Error...")
                    .setDescription('Error occored fetching town.')
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