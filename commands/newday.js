require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const axios = require('axios'); 
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);


module.exports = {

    data: new SlashCommandBuilder()
		.setName('newday')
		.setDescription('Display all towns about to fall.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        async function ItemAPICalls(townArray, newdayArray) {
            await Promise.all(
                townArray.map(async (item) => {
                    try {
                        const townName = await AddItemToArray(item);
                        if (townName) {
                            newdayArray.push(townName);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })
            );
        }
          
        async function AddItemToArray(item) {
            try {
                const res = await axios.get(`https://api.earthmc.net/v1/aurora/towns/${item}`);
                
                var posX = res.data['spawn']['x'];
                var posZ = res.data['spawn']['z'];
                var townBal = res.data['stats']['balance'];
                var townPlots = res.data['stats']['numTownBlocks'];
                const townName = res.data['strings']['town'];

                const testName = `[${townName}](https://earthmc.net/map/aurora/?worldname=earth&mapname=flat&zoom=5&x=${posX}&z=${posZ}) | ${townPlots} Chunks | ${townBal}G in bank`;
                if (res.data['status']['isRuined'] == false) {
                    return testName;
                }
            } catch (error) {
                console.log(error);
            }
        }

        try {
            readFileAsync('data/newdayList.json', 'utf8')
            .then(async (data) => {
                
                const jsonData = JSON.parse(data);
                const removedList = jsonData.map((list) => list.slice(1));
                const townArray = removedList.flat();
                const newdayArray = [];

                //Call API for each item in the .json file 
                await ItemAPICalls(townArray, newdayArray);
                console.log(newdayArray);

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle('Towns Falling Next Newday')
                    .setDescription(newdayArray.join('\n'))
                    .setTimestamp()
                    .setFooter({
                        text: 'EMCHub : nomad#1418',
                    });

                interaction.reply({ embeds: [embedUser] });
                
            })
            .catch(async (err) => {
                console.error(err);
                const embedUser = new EmbedBuilder()
                    .setColor('#c9372c')
                    .setTitle('Error...')
                    .setDescription('Error occurred fetching towns.')
                    .setTimestamp()
                    .setFooter({
                        text: 'EMCHub : nomad_sky',
                    });
                await interaction.deferReply();
                await interaction.reply({ embeds: [embedUser] });
            });
                
        } catch (error) {
            console.log(error);
            const embedUser = new EmbedBuilder()
                .setColor('#c9372c')
                .setTitle('Error...')
                .setDescription('Error occurred writing command.')
                .setTimestamp()
                .setFooter({
                    text: 'EMCHub : nomad_sky',
                });
            await interaction.deferReply();
            await interaction.reply({ embeds: [embedUser] });
        }
    }
}

