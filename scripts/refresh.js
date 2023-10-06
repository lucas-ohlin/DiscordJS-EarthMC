require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const axios = require('axios'); 
const fs = require('fs');

function SaveToFile(list, filePath) {
    //Convert the list to JSON format with indentation
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

        //Not the official API but the one provided by Owen 
        axios.get(`https://emctoolkit.vercel.app/api/aurora/towns`, {
            headers: {
                "Content-type": "Application/json"
            }
        })
        .then(async (res) => {       
            
            const dataArray = Array.from(res.data);
            const mayorList = dataArray.map((item) => item['mayor']);

            //Save all of them to a file
            await SaveToFile(mayorList, 'data/mayorlist.json');
            console.log("Done");
        })
        .catch((err) => {
            console.error('Error : ', err)
        })

    } catch(error) {
        console.log(error);
    }
})();
