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

    const customMessage = await getWelcome(id);

    const groupMetadata = await sock.groupMetadata(id);

    const groupName = groupMetadata.subject;

    const totalMembers = groupMetadata.participants.length;

    const channelInfo = {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363426421968955@newsletter',
                newsletterName: 'Kazi-md-bot-4X',
                serverMessageId: 1
            }
        }
    };

    for (const participant of participants) {

        try {

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            let profilePicUrl =
                'https://files.catbox.moe/8jv8gk.jpg';

            try {

                const pp = await sock.profilePictureUrl(
                    participantString,
                    'image'
                );

                if (pp) profilePicUrl = pp;

            } catch (e) {
                console.log('Profile picture not found');
            }

            let finalMessage;

            if (customMessage) {

                finalMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{members}/g, totalMembers);

            } else {

                finalMessage = `
╭━━━〔 🌸 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 🌸 〕━━━⬣

┃ 👤 𝑵𝒂𝒎𝒆 : @${user}
┃ 👥 𝑴𝒆𝒎𝒃𝒆𝒓𝒔 : ${totalMembers}
┃ 🏡 𝑮𝒓𝒐𝒖𝒑 : ${groupName}

╰━━━━━━━━━━━━━━━━━━⬣

🌺✨ 𝑨𝒔𝒔𝒂𝒍𝒂𝒎𝒖 𝑨𝒍𝒂𝒊𝒌𝒖𝒎 ✨🌺

💖 𝑯𝒆𝒚 @${user}
𝒀𝒐𝒖 𝒂𝒓𝒆 𝒎𝒐𝒔𝒕 𝒘𝒆𝒍𝒄𝒐𝒎𝒆
𝒕𝒐 𝒐𝒖𝒓 𝒍𝒐𝒗𝒆𝒍𝒚 𝒇𝒂𝒎𝒊𝒍𝒚 🥰

🌸 𝑺𝒕𝒂𝒚 𝑨𝒄𝒕𝒊𝒗𝒆
🌸 𝑹𝒆𝒔𝒑𝒆𝒄𝒕 𝑬𝒗𝒆𝒓𝒚𝒐𝒏𝒆
🌸 𝑬𝒏𝒋𝒐𝒚 & 𝑪𝒉𝒊𝒍𝒍
🌸 𝑴𝒂𝒌𝒆 𝑭𝒓𝒊𝒆𝒏𝒅𝒔

╭━━━━━━━━━━━━━━⬣
┃ 💫 𝑬𝒏𝒋𝒐𝒚 𝒀𝒐𝒖𝒓 𝑺𝒕𝒂𝒚 💫
╰━━━━━━━━━━━━━━⬣

☕ 𝑯𝒂𝒗𝒆 𝑭𝒖𝒏 & 𝑺𝒕𝒂𝒚 𝑺𝒂𝒇𝒆 💖

> 🌿 Powered By Kazi-md-bot-4X
`;
            }

            await sock.sendMessage(id, {
                image: {
                    url: 'https://files.catbox.moe/8jv8gk.jpg'
                },
                caption: finalMessage,
                mentions: [participantString],
                jpegThumbnail: null,
                ...channelInfo
            });

        } catch (error) {

            console.log('Welcome Error:', error);

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : (participant.id || participant.toString());

            const user = participantString.split('@')[0];

            await sock.sendMessage(id, {
                text: `
╭━━━〔 🌸 WELCOME 🌸 〕━━━⬣

👤 User : @${user}
👥 Members : ${totalMembers}

✨ Welcome To ${groupName} ✨
`,
                mentions: [participantString],
                ...channelInfo
            });
        }
    }
}

export { handleJoinEvent };
