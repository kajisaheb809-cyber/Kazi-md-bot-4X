const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'topMembers.json');

// NEWSLETTER INFO
const NEWSLETTER_JID = '120363426421968955@newsletter';
const NEWSLETTER_NAME = 'Kazi-md-bot-4X';

// Load data
function loadData() {

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }

    return JSON.parse(fs.readFileSync(filePath));
}

// Save data
function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {

    config: {
        name: "top",
        aliases: ["topmembers", "leaderboard"],
        permission: 1,
        prefix: true,
        cooldowns: 5,
        description: "Show top active members",
        usage: ".top",
        categories: "admin",
        credit: "Kazi-md-bot-4X"
    },

    // AUTO MESSAGE COUNT
    event: async ({ event }) => {

        const { threadId, senderId, isGroup } = event;

        if (!isGroup) return;

        const data = loadData();

        if (!data[threadId]) data[threadId] = {};
        if (!data[threadId][senderId]) {
            data[threadId][senderId] = 0;
        }

        data[threadId][senderId]++;

        saveData(data);
    },

    // COMMAND
    start: async ({ event, api, args }) => {

        const { threadId, isGroup } = event;

        // GROUP CHECK
        if (!isGroup) {

            return api.sendMessage(
                '❌ This command only works in groups!',
                threadId
            );
        }

        const data = loadData();

        const groupData = data[threadId] || {};

        const limit = parseInt(args[0]) || 10;

        const topUsers = Object.entries(groupData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);

        // NO DATA
        if (topUsers.length === 0) {

            return api.sendMessage(
                '❌ No active members found!',
                threadId
            );
        }

        let msg = `🏆 *TOP ${limit} ACTIVE MEMBERS*\n\n`;

        topUsers.forEach(([uid, count], index) => {

            msg += `╭─❏ ${index + 1}\n`;
            msg += `┃ 👤 @${uid.split('@')[0]}\n`;
            msg += `┃ 💬 ${count} messages\n`;
            msg += `╰────────────❏\n\n`;

        });

        msg += `━━━━━━━━━━━━━━━\n`;
        msg += `📢 Kazi-md-bot-4X Channel`;

        // SEND MESSAGE
        await api.sendMessage(
            threadId,
            {
                text: msg,
                mentions: topUsers.map(([uid]) => uid),

                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: NEWSLETTER_JID,
                        newsletterName: NEWSLETTER_NAME,
                        serverMessageId: 1
                    }
                }
            }
        );
    }
};
