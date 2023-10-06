require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios'); 


module.exports = {

    data: new SlashCommandBuilder()
		.setName('town')
		.setDescription('Display information about a town')
        .addStringOption(option => option.setName('name')
            .setDescription("Town name.")
            .setRequired(true)),   

    async execute(interaction) {

        const town = interaction.options.getString("name");

        try {

            //EMC's official API
            axios.get(`https://api.earthmc.net/v1/aurora/towns/${town}`, {
                headers: {
                    "Content-type": "Application/json",
                }
            })
            .then(async (res) => {       

                console.log(res);
                
                //Save the residents to an array
                let resList = [];
                for (var resident in res.data['residents']) {
                    resList.push(resident);
                }

                //Postion of the spawn
                var posX = Math.floor(res.data['spawn']['x']);
                var posZ = Math.floor(res.data['spawn']['z']); 

                //Established
                var registeredTime = await Math.round(res.data['timestamps']['registered']/1000);
                var joinedNationTime = await Math.round(res.data['timestamps']['joinedNationAt']/1000);

                //Flag perms
                var mobFlag = res.data['perms']['flagPerms']['mobs'] === false ? "❌" : "✅";
                var explosionFlag = res.data['perms']['flagPerms']['explosion'] === false ? "❌" : "✅";
                var fireFlag = res.data['perms']['flagPerms']['fire'] === false ? "❌" : "✅";
                var pvpFlag = res.data['perms']['flagPerms']['pvp'] === false ? "❌" : "✅";
                //status 
                var neutralStatus = res.data['status']['isNeutral'] === false ? "❌" : "✅";
                var capitalStatus = res.data['status']['isCapital'] === false ? "❌" : "✅";
                var openStatus = res.data['status']['isOpen'] === false ? "❌" : "✅";
                var ruinedStatus = res.data['status']['isRuined'] === false ? "❌" : "✅";
                var publicStatus = res.data['status']['isPublic'] === false ? "❌" : "✅";
                var overclaimedStatus = res.data['status']['isOverClaimed'] === false ? "❌" : "✅";

                const embedUser = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle(`Town Info `+'`'+`${town.charAt(0).toUpperCase() + town.slice(1)}`+'`')
                    // .setDescription( ```fix Yellow```)
                    .addFields(
                        { name: 'Mayor', value: res.data['strings']['mayor'], inline: true},
                        { name: 'Nation', value: `${res.data['affiliation']['nation']}`, inline: true},
                        { name: 'Residents', value: `${resList.length}`, inline: true},

                        { name: 'Map', value: `[${posX} ${posZ}](https://earthmc.net/map/aurora/?worldname=earth&mapname=flat&zoom=5&x=${posX}&z=${posZ})` , inline: true},
                        { name: 'Town Claims', value: `${res.data['stats']['numTownBlocks']} / ${res.data['stats']['maxTownBlocks']}\n(${res.data['stats']['numTownBlocks'] * 16}G)`, inline: true },
                        { name: 'Town Balance', value: `${res.data['stats']['balance']}G`, inline: true},

                        { name: 'Created', value: '<t:'+registeredTime+'>', inline: true},
                        { name: 'Joined Nation', value: '<t:'+joinedNationTime+'>', inline: true},
                        { name: 'Founder', value: `${res.data['strings']['founder']}`, inline: true},
                        
                        { name: 'Status', value: `${neutralStatus} Neutral\n${capitalStatus} Capital\n${openStatus} Open\n${ruinedStatus} Ruined\n${publicStatus} Public\n${overclaimedStatus} OverClaimed\n`, inline: true},
                        { name: 'Flags', value: `${mobFlag} Mobs\n${explosionFlag} Explosion\n${fireFlag} Fire\n${pvpFlag} PVP\n`, inline: true},
                    )
                    .setTimestamp()
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