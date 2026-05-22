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

const CHANNEL_JID = '120363426421968955@newsletter';
const BOT_NAME = 'Kazi-MD-Bot-4X';

module.exports = {
    name: 'anti18',
    aliases: ['antinsfw', 'antiporn'],
    category: 'group',
    desc: 'Auto kick 18+ media',
    usage: '.anti18 on/off',
    group: true,
    admin: true,

    async execute(sock, m, args) {

        const from = m.key.remoteJid;

        let data = getData();

        if (!args[0]) {
            return sock.sendMessage(from, {
                text:
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ Usage:
┃ .anti18 on
┃ .anti18 off
┃
╰━━━━━━━━━━━━⬣`
            }, { quoted: m });
        }

        if (args[0].toLowerCase() === 'on') {

            data[from] = true;
            saveData(data);

            return sock.sendMessage(from, {
                text:
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ ✅ Anti 18+ Enabled
┃
┃ Sticker = Kick
┃ Video = Kick
┃ Image = Kick
┃ GIF = Kick
┃
╰━━━━━━━━━━━━⬣`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: CHANNEL_JID,
                        newsletterName: BOT_NAME,
                        serverMessageId: 1
                    }
                }
            }, { quoted: m });
        }

        if (args[0].toLowerCase() === 'off') {

            data[from] = false;
            saveData(data);

            return sock.sendMessage(from, {
                text:
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ ❌ Anti 18+ Disabled
┃
╰━━━━━━━━━━━━⬣`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: CHANNEL_JID,
                        newsletterName: BOT_NAME,
                        serverMessageId: 1
                    }
                }
            }, { quoted: m });
        }
    }
};

module.exports.before = async (sock, m) => {

    try {

        const from = m.key.remoteJid;

        if (!from.endsWith('@g.us')) return;

        const sender =
            m.key.participant ||
            m.participant ||
            m.key.remoteJid;

        const data = getData();

        if (!data[from]) return;

        const msg = m.message || {};

        const isSticker =
            !!msg.stickerMessage;

        const isVideo =
            !!msg.videoMessage;

        const isImage =
            !!msg.imageMessage;

        const isGif =
            msg.videoMessage?.gifPlayback || false;

        const isViewOnce =
            !!msg.viewOnceMessage;

        if (
            !isSticker &&
            !isVideo &&
            !isImage &&
            !isGif &&
            !isViewOnce
        ) return;

        const metadata =
            await sock.groupMetadata(from);

        const participants =
            metadata.participants;

        const botNumber =
            sock.user.id.split(':')[0] +
            '@s.whatsapp.net';

        const botAdmin =
            participants.find(
                p =>
                    p.id === botNumber &&
                    (p.admin === 'admin' ||
                     p.admin === 'superadmin')
            );

        if (!botAdmin) return;

        const senderData =
            participants.find(
                p => p.id === sender
            );

        if (
            senderData &&
            (senderData.admin === 'admin' ||
             senderData.admin === 'superadmin')
        ) return;

        await sock.sendMessage(from, {
            text:
`╭━━〔 ${BOT_NAME} 〕━━⬣
┃
┃ 🚫 18+ Media Detected
┃
┃ User Removed Successfully
┃
┃ @${sender.split('@')[0]}
┃
╰━━━━━━━━━━━━⬣`,
            mentions: [sender],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: CHANNEL_JID,
                    newsletterName: BOT_NAME,
                    serverMessageId: 1
                }
            }
        }, { quoted: m });

        await sock.groupParticipantsUpdate(
            from,
            [sender],
            'remove'
        );

    } catch (e) {
        console.log(e);
    }
};
