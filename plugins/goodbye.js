import fetch from 'node-fetch';
import { handleGoodbye } from '../lib/welcome.js';
import { isGoodByeOn, getGoodbye } from '../lib/index.js';

async function handleLeaveEvent(sock, id, participants) {

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
                    : participant.id;

            const user = participantString.split('@')[0];

            let profilePic = 'https://i.imgur.com/6sVzN8B.jpeg';

            try {
                profilePic = await sock.profilePictureUrl(participantString, 'image');
            } catch {
                console.log('Profile picture not found');
            }

            let finalMessage;

            if (customMessage) {

                finalMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName);

            } else {

                finalMessage = `
╭━━━〔 💔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 💔 〕━━━⬣

👤 User : @${user}
🌸 Group : ${groupName}
👥 Members : ${totalMembers}

━━━━━━━━━━━━━━

*❛❛ Feelings never fade 🦋 ❜❜*
*Some memories stay forever… even when people don’t ✨🌸💙*

*This was a fun hangout group ⎯⃝🥹🍃💘*
*We shared laughs, late-night talks & moments 🦚🌻*

*Don’t forget us ☝️🥹🍒🤌*
*~⎯͢⎯⃝💞 Come back again!~*

*Your presence will be missed tonight 🫵🥹💖🦚*
*Thanks for being with us ❤‍🩹🌺*

━━━━━━━━━━━━━━

💚 Kazi-md-bot-4X
╰━━━━━━━━━━━━━━━━━━⬣
`;
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

        const chatId = context.chatId || message.key.remoteJid;
        const matchText = args.join(' ');

        await handleGoodbye(sock, chatId, message, matchText);
    },

    handleLeaveEvent
};
