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
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363426421968955@newsletter',
                newsletterName: 'Kazi-md-bot-4X',
                serverMessageId: -1
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
                'https://i.imgur.com/9fY0B6m.jpeg';

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
╭━━━〔 🌸 WELCOME 🌸 〕━━━⬣
┃ 👤 User : @${user}
┃ 👥 Total Members : ${totalMembers}
╰━━━━━━━━━━━━━━━━━━⬣

✨ Welcome To *${groupName}* ✨

╭━━━━━━━━━━━━━━━⬣
┃ 🕌 السلام عليكم ورحمة الله وبركاته
┃ ✨ Assalamualaikum Warahmatullahi Wabarakatuh ✨
╰━━━━━━━━━━━━━━━⬣

🌸💫 Dear New Member,
Welcome to our family 💖

🥺 তোমাকে পারমিশন ছাড়া অ্যাড দেওয়ার জন্য
সত্যিই দুঃখিত।

💬 তবে এখন যখন চলে এসেছো,
আমাদের সাথেই থেকো।

🎉 ফ্রি টাইমে আড্ডা দাও,
মজা করো, চিল করো।

💖 কারণ এই জায়গাটাই ভরা
Positive Vibes দিয়ে।

🙃 আজ আছি, কাল থাকবো কি না
কে জানে।

🤲 যদি কখনো কোনো ভুল করি,
ক্ষমার চোখে দেখো।

☕ তোমার জন্য স্পেশাল
চায়ের দাওয়াত রইলো 😋

💞 Enjoy করো,
সবাইকে আপন করে নাও।

╭━━━━━━━━━━━━━━━⬣
┃ 🌿✨ ADMIN TEAM ✨🌿
╰━━━━━━━━━━━━━━━⬣

🌺 May Allah bless our gathering
and make it a source of benefit
for all of us. Ameen! 🌺

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Kazi-md-bot-4X
`;
            }

            const apiUrl =
                `https://api.popcat.xyz/welcomecard?background=https://i.imgur.com/9fY0B6m.jpeg&text1=${encodeURIComponent(user)}&text2=${encodeURIComponent(groupName)}&text3=Members:+${totalMembers}&avatar=${encodeURIComponent(profilePicUrl)}`;

            await sock.sendMessage(id, {
                image: { url: apiUrl },
                caption: finalMessage,
                mentions: [participantString],
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
┃ 👤 User : @${user}
┃ 👥 Total Members : ${totalMembers}
╰━━━━━━━━━━━━━━━━━━⬣

✨ Welcome To *${groupName}* ✨
`,
                mentions: [participantString],
                ...channelInfo
            });
        }
    }
}

export { handleJoinEvent };
