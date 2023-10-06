require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('joinable')
		.setDescription('All nations within a 2.5k block radius from a town.')
        .addStringOption(option => option.setName('name')
            .setDescription("Town name.")
            .setRequired(true)),   

    async execute(interaction) {

        const town = interaction.options.getString("name");

        try {

            //EMC's official API https://api.earthmc.net/v1/aurora/nations/${nation}
            axios.get(`https://emctoolkit.vercel.app/api/aurora/towns/${town}/joinable`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then(async (res) => {       

                console.log(res);
                
                //Convert the res.data to an array so the .map function can work more reliably
                const dataArray = Array.from(res.data);
                
                //Two arrays containing towns and mayors seperatly
                const nationList = await dataArray.map((item) => '`'+item['name']+'`').join("\r\n");
                const leaderList = await dataArray.map((item) => '`'+item['king']+'`').join("\r\n");

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle(`Joinable Nations ` + '`'+`${town.charAt(0).toUpperCase() + town.slice(1)}`+'`')
                    .addFields(
                        { name: 'Nation', value: nationList, inline: true },
                        { name: 'Leader', value: leaderList, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({
                        text:'EMCHub : nomad_sky',
                    });

                await interaction.reply({ embeds:[embedUser] });    

            })
            .catch((err) => {
                console.error('Error : ', err)
                const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle("Error...")
                    .setDescription('Error occored fetching joinable nations.\nAPI rate might have been reached.')
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