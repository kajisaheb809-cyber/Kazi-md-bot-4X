import { handleWelcome } from '../lib/welcome.js';
import { isWelcomeOn, getWelcome } from '../lib/index.js';

export default {
    command: 'welcome',
    aliases: ['setwelcome'],
    category: 'admin',
    description: 'Configure welcome message for the group',
    usage: '.welcome [on/off/message]',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context) {

        const { chatId } = context;
        const matchText = args.join(' ');

        await handleWelcome(sock, chatId, message, matchText);
    }
};

async function handleJoinEvent(sock, id, participants) {

    const isWelcomeEnabled = await isWelcomeOn(id);

    if (!isWelcomeEnabled) return;

    const groupMetadata = await sock.groupMetadata(id);

    const groupName = groupMetadata.subject;

    const totalMembers = groupMetadata.participants.length;

    for (const participant of participants) {

        try {

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            let profilePicUrl;

            try {

                profilePicUrl = await sock.profilePictureUrl(
                    participantString,
                    'image'
                );

            } catch {

                profilePicUrl =
                    'https://files.catbox.moe/8jv8gk.jpg';
            }

            const finalMessage =
`╭━━━〔 🌸 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 🌸 〕━━━⬣

🎉✨ 𝐇𝐞𝐲 @${user},

╭──────────────⬣
│ 🏡 𝐆𝐫𝐨𝐮𝐩 : ${groupName}
│ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 : ${totalMembers}
╰──────────────⬣

🌸 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 𝐭𝐨 𝐨𝐮𝐫
𝐥𝐨𝐯𝐞𝐥𝐲 𝐟𝐚𝐦𝐢𝐥𝐲 💖

✨ 𝐒𝐭𝐚𝐲 𝐀𝐜𝐭𝐢𝐯𝐞
✨ 𝐑𝐞𝐬𝐩𝐞𝐜𝐭 𝐄𝐯𝐞𝐫𝐲𝐨𝐧𝐞
✨ 𝐄𝐧𝐣𝐨𝐲 & 𝐂𝐡𝐢𝐥𝐥
✨ 𝐌𝐚𝐤𝐞 𝐍𝐞𝐰 𝐅𝐫𝐢𝐞𝐧𝐝𝐬

╭──────────────⬣
│ 💫 𝐄𝐧𝐣𝐨𝐲 𝐘𝐨𝐮𝐫 𝐒𝐭𝐚𝐲
╰──────────────⬣

☕ 𝐇𝐚𝐯𝐞 𝐅𝐮𝐧 & 𝐒𝐭𝐚𝐲 𝐒𝐚𝐟𝐞 💞

> 🌿 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 Kazi-md-bot-4X`;

            await sock.sendMessage(id, {

                image: {
                    url: profilePicUrl
                },

                caption: finalMessage,

                mentions: [participantString],

                contextInfo: {

                    mentionedJid: [participantString],

                    forwardingScore: 999,
                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {
                        newsletterJid:
                        '120363426421968955@newsletter',

                        newsletterName:
                        'Kazi-md-bot-4X',

                        serverMessageId: 1
                    },

                    externalAdReply: {

                        title: '🌸 Welcome To Our Group 🌸',

                        body: groupName,

                        thumbnailUrl:
                        'https://files.catbox.moe/8jv8gk.jpg',

                        mediaType: 1,

                        renderLargerThumbnail: true,

                        showAdAttribution: true
                    }
                }

            });

        } catch (error) {

            console.log('Welcome Error:', error);
        }
    }
}

export { handleJoinEvent };
