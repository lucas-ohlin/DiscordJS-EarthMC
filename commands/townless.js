require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('townless')
		.setDescription('Display currently online townless players.'),   

    async execute(interaction) {

        try {

            //Not the official API but the one provided by Owen https://emctoolkit.vercel.app/api/aurora/townlessplayers
            axios.get(`https://emctoolkit.vercel.app/api/aurora/townlessplayers`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then(async (res) => {       

                console.log(res);
                
                //Convert the res.data to an array so the .map function can work more reliably
                const dataArray = Array.from(res.data);

                const townlessList = await dataArray.map((item) => 
                    item['name']
                ).join("\r\n");

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle("Townless Players On Aurora")
                    .setDescription(
                        '```'+townlessList+'```'
                    )
                    .setTimestamp()
                    .setFooter({
                        text:'EMCHub : nomad_sky',
                        // iconURL:'https://i.imgur.com/a/bEJlKRY.png' 
                    });
                    
                await interaction.reply({ embeds:[embedUser] });    

            })
            .catch((err) => {
                console.error('Error : ', err)
                const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle("Error...")
                    .setDescription('Error occored fetching players.')
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