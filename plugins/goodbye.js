import fetch from 'node-fetch';
import { handleGoodbye } from '../lib/welcome.js';
import { isGoodByeOn, getGoodbye } from '../lib/index.js';

async function handleLeaveEvent(sock, id, participants) {

    const isGoodbyeEnabled =
        await isGoodByeOn(id);

    if (!isGoodbyeEnabled) return;

    const customMessage =
        await getGoodbye(id);

    const groupMetadata =
        await sock.groupMetadata(id);

    const groupName =
        groupMetadata.subject;

    const totalMembers =
        groupMetadata.participants.length;

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

            let finalMessage;

            if (customMessage) {

                finalMessage =
                    customMessage
                    .replace(
                        /{user}/g,
                        `@${user}`
                    )
                    .replace(
                        /{group}/g,
                        groupName
                    );

            } else {

                finalMessage =
`╭━━━〔 💔 𝙶𝙾𝙾𝙳𝘽𝚈𝙴 💔 〕━━━⬣

┃ 🥀 𝙶𝙾𝙾𝘿𝘽𝚈𝙴 @${user}
┃ 🏡 𝙶𝚁𝙾𝚄𝙿 : ${groupName}
┃ 👥 𝚃𝙾𝚃𝙰𝙻 : ${totalMembers}
┃
┃ 😔 𝚆𝙴 𝚆𝙸𝙻𝙻 𝙼𝙸𝚂𝚂 𝚈𝙾𝚄
┃
┃ 🌸 𝚃𝙷𝙰𝙽𝙺 𝚈𝙾𝚄
┃ 𝙵𝙾𝚁 𝚂𝙿𝙴𝙽𝙳𝙸𝙽𝙶
┃ 𝚃𝙸𝙼𝙴 𝚆𝙸𝚃𝙷 𝚄𝚂 💖
┃
┃ 🤲 𝙼𝙰𝚈 𝙰𝙻𝙻𝙰𝙷
┃ 𝙱𝙻𝙴𝚂𝚂 𝚈𝙾𝚄
┃ 𝙰𝙻𝚆𝙰𝚈𝚂 ✨
┃
┃ 💫 𝚃𝙰𝙺𝙴 𝙲𝙰𝚁𝙴
┃ 𝙰𝙽𝙳 𝚂𝚃𝙰𝚈 𝚂𝙰𝙵𝙴
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`;
            }

            await sock.sendMessage(
                id,
                {
                    image: {
                        url: profilePic
                    },

                    caption: finalMessage,

                    mentions: [
                        participantString
                    ]
                }
            );

        } catch (error) {

            console.log(
                'Goodbye Error:',
                error
            );
        }
    }
}

export default {

    command: 'goodbye',

    aliases: [
        'bye',
        'leave'
    ],

    category: 'admin',

    description:
        'Configure goodbye messages',

    usage:
        '.goodbye on/off',

    groupOnly: true,

    adminOnly: true,

    async handler(
        sock,
        message,
        args,
        context
    ) {

        const chatId =
            context.chatId
            || message.key.remoteJid;

        const matchText =
            args.join(' ');

        await handleGoodbye(
            sock,
            chatId,
            message,
            matchText
        );
    },

    handleLeaveEvent
};
