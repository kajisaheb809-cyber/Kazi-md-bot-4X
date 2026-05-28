import fetch from 'node-fetch';
import { handleGoodbye } from '../lib/welcome.js';
import { isGoodByeOn } from '../lib/index.js';

async function handleLeaveEvent(sock, id, participants, action = 'leave') {

    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled) return;

    const groupMetadata = await sock.groupMetadata(id);

    const groupName = groupMetadata.subject;
    const totalMembers = groupMetadata.participants.length;
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
                    : participant.id || participant.toString();

            const user = participantString.split('@')[0];

            let profilePic =
                'https://i.imgur.com/6sVzN8B.jpeg';

            try {

                profilePic = await sock.profilePictureUrl(
                    participantString,
                    'image'
                );

            } catch {

                console.log('No profile picture');

            }

            let finalMessage = '';

            // =========================
            // REMOVE MESSAGE
            // =========================

            if (action === 'remove') {

                finalMessage = `
╭━━━〔 🚫 𝗠𝗘𝗠𝗕𝗘𝗥 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 🚫 〕━━━⬣

┃ 👤 USER : @${user}
┃ 🌸 GROUP : ${groupName}
┃ 👥 MEMBERS : ${totalMembers}
┃
┃ ━━━━━━━━━━━━━
┃   📢 *🕌 *السلام عليكم ورحمة الله وبركاته*
┃ *❛❛ Feelings never fade 🦋 ❜❜*
┃ *Some memories stay forever… even
┃ *when people don’t ✨🌸💙*
┃ *This was a fun hangout group ⎯⃝🥹🍃💘*
┃ *We shared laughs, late-night
┃ talks & moments 🦚🌻.*
┃       *Don’t forget us ☝️🥹🍒🤌*
┃           *~⎯͢⎯⃝💞 Come back again!~*
┃ ✨ MAY ALLAH
┃ BLESS EVERYONE
┃
┃ 💞 TAKE CARE
┃ AND STAY SAFE
┃
┃ ━━━━━━━━━━━━━
┃
┃ > POWERED BY Kazi-md-bot-4X 👑
╰━━━〔 🌸 GOOD LUCK 🌸 〕━━━⬣`;

            } else {

                // =========================
                // LEAVE MESSAGE
                // =========================

                finalMessage = `
╭━━━〔 💔 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 💔 〕━━━⬣

┃ 👤 USER : @${user}
┃ 🌸 GROUP : ${groupName}
┃ 👥 MEMBERS : ${totalMembers}
┃
┃ ━━━━━━━━━━━━━
┃  📢 *🕌 *السلام عليكم ورحمة الله وبركاته*
┃ *❛❛ Feelings never fade 🦋 ❜❜*
┃ *Some memories stay forever… even
┃ when people don’t ✨🌸💙*
┃ *This was a fun hangout group ⎯⃝🥹🍃💘*
┃ *We shared laughs, late-night
┃     talks & moments 🦚🌻.*
┃ *Don’t forget us ☝️🥹🍒🤌*
┃      *~⎯͢⎯⃝💞 Come back again!~*
┃
┃ 💖 THANKS FOR
┃ BEING WITH US
┃
┃ 🌸 COME BACK
┃ AGAIN
┃
┃ ━━━━━━━━━━━━━
┃
┃ > POWERED BY Kazi-md-bot-4X 👑
╰━━━〔 🌸 SEE YOU 🌸 〕━━━⬣`;

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
