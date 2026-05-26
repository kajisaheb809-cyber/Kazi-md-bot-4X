import fetch from 'node-fetch';
import { handleWelcome } from '../lib/welcome.js';
import { isWelcomeOn } from '../lib/index.js';

export default {
    command: 'welcome',
    aliases: ['setwelcome'],
    category: 'admin',
    description: 'Configure welcome message',
    usage: '.welcome on/off',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context) {

        const { chatId } = context;

        const matchText = args.join(' ');

        await handleWelcome(
            sock,
            chatId,
            message,
            matchText
        );
    }
};

async function handleJoinEvent(sock, id, participants) {

    const isWelcomeEnabled =
        await isWelcomeOn(id);

    if (!isWelcomeEnabled) return;

    const groupMetadata =
        await sock.groupMetadata(id);

    const groupName =
        groupMetadata.subject;

    const totalMembers =
        groupMetadata.participants.length;

    const channelInfo = {

        contextInfo: {

            forwardingScore: 999,
            isForwarded: true,

            forwardedNewsletterMessageInfo: {

                newsletterJid:
                '120363426421968955@newsletter',

                newsletterName:
                'Kazi-md-bot-4X',

                serverMessageId: 1
            }
        }
    };

    for (const participant of participants) {

        try {

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : participant.id;

            const user =
                participantString.split('@')[0];

            let profilePic =
                'https://i.imgur.com/6sVzN8B.jpeg';

            try {

                profilePic =
                    await sock.profilePictureUrl(
                        participantString,
                        'image'
                    );

            } catch {

                console.log(
                    'Profile picture not found'
                );
            }

            const finalMessage =
`╭━━━〔 🌸 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 🌸 〕━━━⬣

┃ 🦚⃝⃕⃔ 𝙷𝙴𝚈 @${user}
┃ 🏡 𝙶𝚁𝙾𝚄𝙿 : ${groupName}
┃ 👥 𝚃𝙾𝚃𝙰𝙻 : ${totalMembers}
┃
┃ 🕌 السلام عليكم ورحمة الله وبركاته
┃ ✨ Assalamualaikum Warahmatullahi Wabarakatuh
┃
┃ ❛❛ 𝙴𝚅𝙴𝚁𝚈 𝙽𝙴𝚆 𝙹𝙾𝙸𝙽 𝙸𝚂
┃ 𝙰 𝙽𝙴𝚆 𝙻𝙸𝚃𝚃𝙻𝙴 𝙲𝙴𝙻𝙴𝙱𝚁𝙰𝚃𝙸𝙾𝙽 ❜❜ 🌷
┃
┃ 𝚈𝙾𝚄𝚁 𝙰𝚁𝚁𝙸𝚅𝙰𝙻 𝙼𝙰𝙺𝙴𝚂
┃ 𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿 𝙼𝙾𝚁𝙴 𝙱𝙴𝙰𝚄𝚃𝙸𝙵𝚄𝙻 💖
┃
┃ 𝙼𝙰𝚈 𝚈𝙾𝚄 𝙵𝙸𝙽𝙳
┃ 𝙵𝚁𝙸𝙴𝙽𝙳𝚂𝙷𝙸𝙿, 𝙵𝚄𝙽
┃ 𝙰𝙽𝙳 𝙿𝙴𝙰𝙲𝙴𝙵𝚄𝙻 𝚅𝙸𝙱𝙴𝚂 🫶
┃
┃ 𝚂𝚃𝙰𝚈 𝚆𝙸𝚃𝙷 𝚄𝚂
┃ 𝙰𝙽𝙳 𝙴𝙽𝙹𝙾𝚈 ✨
┃
┃ 𝚆𝙰𝚁𝙼 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 💞
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`;

            await sock.sendMessage(
                id,
                {
                    image: {
                        url: profilePic
                    },

                    caption: finalMessage,

                    mentions: [
                        participantString
                    ],

                    ...channelInfo
                }
            );

        } catch (error) {

            console.log(
                'Welcome Error:',
                error
            );
        }
    }
}

export { handleJoinEvent };
