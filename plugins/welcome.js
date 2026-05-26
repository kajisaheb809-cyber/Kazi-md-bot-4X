import { handleWelcome } from '../lib/welcome.js';
import { isWelcomeOn } from '../lib/index.js';
import fetch from 'node-fetch';

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
                    '120363406588763460@newsletter',

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
`📢 *🕌 السلام عليكم ورحمة الله وبركاته*
✨ *Assalamualaikum Warahmatullahi Wabarakatuh* ✨

🌸💫 *Dear New Member Welcome To Our Group*

👋 Hello @${user}

🏡 *Group:* ${groupName}

👥 *Total Members:* ${totalMembers}

💖 Stay active & enjoy
🎉 Have fun with everyone

☕ Special tea for you 😋

🌿 Enjoy Your Stay Here 🌿

> Powered By Kazi-md-bot-4X`;

            await sock.sendMessage(
                id,
                {
                    image: {
                        url: profilePic
                    },

                    caption: finalMessage,

                    mentions: [participantString],

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
