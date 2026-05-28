import fetch from 'node-fetch';
import { handleGoodbye } from '../lib/welcome.js';
import { isGoodByeOn, getGoodbye } from '../lib/index.js';

async function handleLeaveEvent(sock, id, participants, action = 'leave') {

    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    const customMessage = await getGoodbye(id);

    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const totalMembers = groupMetadata.participants.length;

    for (const participant of participants) {

        try {

            const participantString =
                typeof participant === 'string'
                    ? participant
                    : participant.id || participant.toString();

            const user = participantString.split('@')[0];

            let profilePic = 'https://i.imgur.com/6sVzN8B.jpeg';

            try {
                profilePic = await sock.profilePictureUrl(
                    participantString,
                    'image'
                );
            } catch {
                console.log('Profile picture not found');
            }

            let finalMessage;

            // REMOVE MESSAGE
            if (action === 'remove') {

                finalMessage =
`╭━━━〔 🚫 𝗠𝗘𝗠𝗕𝗘𝗥 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 🚫 〕━━━⬣

┃ 👤 𝗨𝗦𝗘𝗥 : @${user}
┃ 🌸 𝗚𝗥𝗢𝗨𝗣 : ${groupName}
┃ 👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 : ${totalMembers}
┃
┃ ━━━━━━━━━━━━━━
┃
┃ 💔 𝗔 𝗠𝗘𝗠𝗕𝗘𝗥
┃ 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡
┃ 𝗥𝗘𝗠𝗢𝗩𝗘𝗗
┃ 𝗙𝗥𝗢𝗠 𝗧𝗛𝗘
┃ 𝗚𝗥𝗢𝗨𝗣 🚫
┃
┃ 🌸 𝗠𝗔𝗬 𝗔𝗟𝗟𝗔𝗛
┃ 𝗚𝗨𝗜𝗗𝗘 𝗔𝗡𝗗
┃ 𝗕𝗟𝗘𝗦𝗦 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘 ✨
┃
┃ 💞 𝗧𝗔𝗞𝗘 𝗖𝗔𝗥𝗘
┃ 𝗔𝗡𝗗 𝗦𝗧𝗔𝗬
┃ 𝗦𝗔𝗙𝗘 🌷
┃
┃ ━━━━━━━━━━━━━━
┃
┃ 💚 𝗞𝗮𝘇𝗶-𝗺𝗱-𝗯𝗼𝘁-4𝗫
╰━━━〔 🌸 𝗚𝗢𝗢𝗗 𝗟𝗨𝗖𝗞 🌸 〕━━━⬣`;

            } else {

                // LEAVE MESSAGE
                finalMessage =
`╭━━━〔 💔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 💔 〕━━━⬣

┃ 👤 𝗨𝗦𝗘𝗥 : @${user}
┃ 🌸 𝗚𝗥𝗢𝗨𝗣 : ${groupName}
┃ 👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 : ${totalMembers}
┃
┃ ━━━━━━━━━━━━━━
┃
┃ ❛❛ 𝗙𝗘𝗘𝗟𝗜𝗡𝗚𝗦
┃ 𝗡𝗘𝗩𝗘𝗥 𝗙𝗔𝗗𝗘 🦋 ❜❜
┃
┃ 𝗦𝗢𝗠𝗘
┃ 𝗠𝗘𝗠𝗢𝗥𝗜𝗘𝗦
┃ 𝗦𝗧𝗔𝗬
┃ 𝗙𝗢𝗥𝗘𝗩𝗘𝗥 ✨
┃
┃ 𝗧𝗛𝗔𝗡𝗞𝗦
┃ 𝗙𝗢𝗥 𝗕𝗘𝗜𝗡𝗚
┃ 𝗪𝗜𝗧𝗛 𝗨𝗦 💖
┃
┃ 💞 𝗖𝗢𝗠𝗘
┃ 𝗕𝗔𝗖𝗞
┃ 𝗔𝗚𝗔𝗜𝗡 🌸
┃
┃ ━━━━━━━━━━━━━━
┃
┃ 💚 𝗞𝗮𝘇𝗶-𝗺𝗱-𝗯𝗼𝘁-4𝗫
╰━━━〔 🌸 𝗦𝗘𝗘 𝗬𝗢𝗨 🌸 〕━━━⬣`;

            }

            // CUSTOM MESSAGE
            if (customMessage) {

                finalMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{members}/g, totalMembers);

            }

            await sock.sendMessage(id, {
                image: { url: profilePic },
                caption: finalMessage,
                mentions: [participantString]
            });

        } catch (error) {
            console.log('Goodbye Error:', error);
        }
    }
}

export default {

    command: 'goodbye',
    aliases: ['bye', 'leave'],
    category: 'admin',
    description: 'Configure goodbye messages',
    usage: '.goodbye on/off',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context) {

        const chatId =
            context.chatId ||
            message.key.remoteJid;

        const matchText = args.join(' ');

        await handleGoodbye(
            sock,
            chatId,
            message,
            matchText
        );
    },

    handleLeaveEvent
};
