import fetch from 'node-fetch';
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

    const customMessage =
        await getWelcome(id);

    const groupMetadata =
        await sock.groupMetadata(id);

    const groupName =
        groupMetadata.subject;

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
                    'Could not fetch display name'
                );
            }

            const now =
                new Date();

            const timeString =
                now.toLocaleString(
                    'en-US',
                    {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
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
                        `@${displayName}`
                    )
                    .replace(
                        /{group}/g,
                        groupName
                    );

            } else {

                finalMessage =
`╭━━━〔 🌸 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 🌸 〕━━━⬣

🎉✨ 𝐇𝐞𝐲 @${displayName}

╭──────────────⬣
│ 🏡 𝐆𝐫𝐨𝐮𝐩 : ${groupName}
│ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬 : ${groupMetadata.participants.length}
│ 📛 𝐉𝐈𝐃 : ${participantString}
│ ⏰ 𝐓𝐈𝐌𝐄 : ${timeString}
╰──────────────⬣

📢 🕌 *السلام عليكم ورحمة الله وبركاته*
✨ *Assalamualaikum Warahmatullahi Wabarakatuh* ✨

🌸💫 *Dear New Member, Welcome To Our Group*

🥺 *তোমাকে পারমিশন ছাড়া অ্যাড দেওয়ার জন্য*
*সত্যিই দুঃখিত*

💬 *তবে এখন যখন চলে এসেছো,*
*আমাদের সাথেই থেকো*

🎉 *ফ্রি টাইমে আড্ডা দাও,*
*মজা করো, চিল করো*

💖 *কারণ এই জায়গাটাই ভরা*
*Positive Vibes দিয়ে*

🙃 *আজ আছি, কাল থাকবো কি না*
*কে জানে*

🤲 *যদি কখনো কোনো ভুল করি,*
*ক্ষমার চোখে দেখো*

☕ *তোমার জন্য স্পেশাল*
*চায়ের দাওয়াত রইলো 😋*

💞 *Enjoy করো,*
*সবাইকে আপন করে নাও*

🌺 *May Allah bless our gathering*
*and make it a source of benefit*
*for all of us. Ameen!* 🌺

╭──────────────⬣
│ 🌿 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘
│ Kazi-md-bot-4X
╰──────────────⬣`;
            }

            let profilePicUrl =
            'https://img.pyrocdn.com/dbKUgahg.png';

            try {

                const profilePic =
                    await sock.profilePictureUrl(
                        participantString,
                        'image'
                    );

                if (profilePic) {

                    profilePicUrl =
                        profilePic;
                }

            } catch {

                console.log(
                    'Could not fetch profile picture'
                );
            }

            await sock.sendMessage(id, {

                image: {
                    url: profilePicUrl
                },

                caption: finalMessage,

                mentions: [
                    participantString
                ],

                ...channelInfo
            });

        } catch (error) {

            console.error(
                'Error sending welcome message:',
                error
            );
        }
    }
}

export { handleJoinEvent };
