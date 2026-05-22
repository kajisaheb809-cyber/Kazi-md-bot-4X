const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../assets/anti18.json');

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
}

function getData() {
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const CHANNEL_JID = '120363406588763460@newsletter';
const BOT_NAME = 'Kazi-MD-Bot-4X';

module.exports = {

    config: {
        name: "anti18",
        aliases: ["antinsfw", "antiporn"],
        version: "1.0",
        author: "ChatGPT",
        role: 1,
        shortDescription: "Auto delete + kick media",
        longDescription: "Delete and kick sticker/video/image/gif sender",
        category: "group",
        guide: ".anti18 on/off"
    },

    onStart: async function ({ message, event, args }) {

        const threadID = event.threadID;

        let data = getData();

        if (!args[0]) {
            return message.reply(
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ .anti18 on
┃ .anti18 off
┃
╰━━━━━━━━━━━━⬣`
            );
        }

        if (args[0].toLowerCase() === "on") {

            data[threadID] = true;

            saveData(data);

            return message.reply(
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ ✅ Anti 18+ Enabled
┃
┃ Sticker ❌
┃ Video ❌
┃ Image ❌
┃ GIF ❌
┃
╰━━━━━━━━━━━━⬣`
            );
        }

        if (args[0].toLowerCase() === "off") {

            data[threadID] = false;

            saveData(data);

            return message.reply(
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ ❌ Anti 18+ Disabled
┃
╰━━━━━━━━━━━━⬣`
            );
        }
    },

    onChat: async function ({ api, event }) {

        try {

            const threadID = event.threadID;
            const senderID = event.senderID;

            const data = getData();

            if (!data[threadID]) return;

            if (!event.attachments) return;

            const attachments = event.attachments;

            const hasBadMedia = attachments.some(att =>
                att.type === "photo" ||
                att.type === "video" ||
                att.type === "animated_image" ||
                att.type === "sticker"
            );

            if (!hasBadMedia) return;

            const threadInfo =
                await api.getThreadInfo(threadID);

            const adminIDs =
                threadInfo.adminIDs.map(
                    a => a.id
                );

            if (adminIDs.includes(senderID))
                return;

            try {

                await api.unsendMessage(
                    event.messageID
                );

            } catch (e) {}

            await api.sendMessage(
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ 🚫 18+ Media Detected
┃
┃ User Removed Successfully
┃
╰━━━━━━━━━━━━⬣`,
            threadID
            );

            await api.removeUserFromGroup(
                senderID,
                threadID
            );

        } catch (err) {
            console.log(err);
        }
    }
};
