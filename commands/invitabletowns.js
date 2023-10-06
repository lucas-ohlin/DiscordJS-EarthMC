require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('invitable')
		.setDescription('All towns not in a nation within 2.5k block of nation.')
        .addStringOption(option => option.setName('name')
            .setDescription("Nation name.")
            .setRequired(true)),   

    async execute(interaction) {

        console.log(interaction.options.getString("name"));
        const nation = interaction.options.getString("name");

        try {

            //EMC's official API https://api.earthmc.net/v1/aurora/nations/${nation}
            axios.get(`https://emctoolkit.vercel.app/api/aurora/nations/${nation}/invitable`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then(async (res) => {       

                console.log(res);

                //Convert the res.data to an array so the .map function can work more reliably
                const dataArray = Array.from(res.data);
                
                //Two arrays containing towns and mayors seperatly
                const townList = await dataArray.map((item) => '`'+item['name']+'`').join("\r\n");
                const mayorList = await dataArray.map((item) => '`'+item['mayor']+'`').join("\r\n");

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle(`Invitable Towns ` + '`'+`${nation.charAt(0).toUpperCase() + nation.slice(1)}`+'`')
                    .addFields(
                        { name: 'Town', value: townList, inline: true },
                        { name: 'Mayor', value: mayorList, inline: true },
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
                    .setDescription('Error occored fetching invitable towns.\nAPI rate might have been reached.')
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