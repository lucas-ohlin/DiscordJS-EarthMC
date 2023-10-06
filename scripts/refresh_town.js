require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const axios = require('axios'); 
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

function SaveToFile(list, filePath) {
    const data = JSON.stringify(list, null, 2); 
  
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('List saved to file:', filePath);
        }
    });
}

(async () => {
    try {
        readFileAsync('data/mayorlist.json', 'utf8')
            .then(async (data) => {

                const jsonData = JSON.parse(data);
                console.log(jsonData);
        
                const newdayArray = [];
                const wipedayTime = Date.now() - (42 * 24 * 60 * 60 * 1000);
        
                for (const item of jsonData) {
                    try {
                        if (item.startsWith("NPC")) { continue; }
                    
                        const res = await axios.get(`https://api.earthmc.net/v1/aurora/residents/${item}`);
                        if (res.data['timestamps']['lastOnline'] < wipedayTime && item != "") {
                            //Push the name of the mayor as well as the towns name
                            newdayArray.push([item, res.data['affiliation']['town']]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            
                await SaveToFile(newdayArray, 'data/newdayList.json');
                console.log("Done");
            })
            .catch((err) => {
                console.error(err);
            });
    
    } catch (error) {
        console.log(error);
    }
})();

