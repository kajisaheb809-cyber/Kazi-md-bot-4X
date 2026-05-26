import fetch from 'node-fetch';
import { handleWelcome } from '../lib/welcome.js';
import { isWelcomeOn, getWelcome } from '../lib/index.js';

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

    const customMessage =
        await getWelcome(id);

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
                    : (
                        participant.id ||
                        participant.toString()
                    );

            const user =
                participantString.split('@')[0];

            let displayName = user;

            try {

                const groupParticipants =
                    groupMetadata.participants;

                const userParticipant =
                    groupParticipants.find(
                        p => p.id === participantString
                    );

                if (
                    userParticipant &&
                    userParticipant.name
                ) {

                    displayName =
                        userParticipant.name;
                }

            } catch {

                console.log(
                    'Error fetching display name'
                );
            }

            const now =
                new Date();

            const timeString =
                now.toLocaleString(
                    'en-US',
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }
                );

            let finalMessage;

            if (customMessage) {

                finalMessage =
                    customMessage
                    .replace(
                        /{user}/g,
                        '@' + displayName
                    )
                    .replace(
                        /{group}/g,
                        groupName
                    );

            } else {

                finalMessage =
'╭━━━〔 🌸 WELCOME 🌸 〕━━━⬣\n\n' +

'🎉✨ Hey @' + displayName + '\n\n' +

'╭──────────────⬣\n' +
'│ 🏡 Group : ' + groupName + '\n' +
'│ 👥 Members : ' + groupMetadata.participants.length + '\n' +
'│ 📛 JID : ' + participantString + '\n' +
'│ ⏰ Time : ' + timeString + '\n' +
'╰──────────────⬣\n\n' +

'📢 السلام عليكم ورحمة الله وبركاته\n\n' +

'✨ Assalamualaikum Warahmatullahi Wabarakatuh ✨\n\n' +

'🌸 Dear New Member,\n' +
'Welcome To Our Group 💖\n\n' +

'🥺 তোমাকে পারমিশন ছাড়া\n' +
'অ্যাড দেওয়ার জন্য দুঃখিত\n\n' +

'💬 এখন যেহেতু চলে এসেছো,\n' +
'আমাদের সাথেই থেকো\n\n' +

'🎉 আড্ডা দাও,\n' +
'মজা করো,\n' +
'চিল করো 😋\n\n' +

'💖 এই গ্রুপটা Positive Vibes দিয়ে ভরা\n\n' +

'🤲 কোনো ভুল হলে\n' +
'ক্ষমার চোখে দেখো\n\n' +

'☕ তোমার জন্য\n' +
'চায়ের দাওয়াত রইলো\n\n' +

'🌺 May Allah bless our gathering\n' +
'and make it beneficial for everyone.\n' +
'Ameen!\n\n' +

'╭──────────────⬣\n' +
'│ 🌿 Powered By\n' +
'│ Kazi-md-bot-4X\n' +
'╰──────────────⬣';
            }

            let profilePicUrl =
                'https://i.imgur.com/JP3QG8B.jpeg';

            try {

                const pp =
                    await sock.profilePictureUrl(
                        participantString,
                        'image'
                    );

                if (pp)
                    profilePicUrl = pp;

            } catch {

                console.log(
                    'Profile picture not found'
                );
            }

            await sock.sendMessage(id, {

                image: {
                    url: profilePicUrl
                },

                caption:
                    finalMessage.trim(),

                mentions: [
                    participantString
                ],

                ...channelInfo

            });

        } catch (error) {

            console.log(
                'Welcome Error:',
                error
            );
        }
    }
}

export { handleJoinEvent };
