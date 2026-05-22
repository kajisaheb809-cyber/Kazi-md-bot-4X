import fs from 'fs';
import path from 'path';

const dbPath = './assets/anti18.json';

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
}

function getData() {
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveData(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const CHANNEL_JID = '120363426421968955@newsletter';
const BOT_NAME = 'Kazi-MD-Bot-4X';

export default {

    config: {
        name: "anti18",
        aliases: ["antinsfw", "antiporn"],
        version: "1.0",
        author: "ChatGPT",
        role: 1,
        shortDescription: "Auto delete + kick",
        longDescription: "Delete and kick media sender",
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
`✅ Anti 18+ Enabled`
            );
        }

        if (args[0].toLowerCase() === "off") {

            data[threadID] = false;

            saveData(data);

            return message.reply(
`❌ Anti 18+ Disabled`
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

            const hasMedia = attachments.some(att =>
                att.type === "photo" ||
                att.type === "video" ||
                att.type === "animated_image" ||
                att.type === "sticker"
            );

            if (!hasMedia) return;

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
`🚫 18+ Media Detected

User Removed Successfully`,
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
