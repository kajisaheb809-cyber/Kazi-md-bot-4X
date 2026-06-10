import fetch from 'node-fetch';
import { handleWelcome } from '../lib/welcome.js';
import { isWelcomeOn } from '../lib/index.js';

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
`╭━━━〔 🌸 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 🌸 〕━━━⬣

┃ 🦚⃝⃕⃔ 𝙷𝙴𝚈 @${user}
┃ 🏡 𝙶𝚁𝙾𝚄𝙿 : ${groupName}
┃ 👥 𝚃𝙾𝚃𝙰𝙻 : ${totalMembers}
┃
┃ 🕊️💞━━━✦❖✦━━━💞🕊️
┃
┃ 🌼 তোমাকে আমাদের পরিবারের
┃ নতুন সদস্য হিসেবে পেয়ে
┃ আমরা সত্যিই অনেক আনন্দিত 🌼
┃
┃ 💖 তোমার আগমনে এই গ্রুপে
┃ যোগ হয়েছে নতুন প্রাণ,
┃ নতুন হাসি আর নতুন গল্পের সূচনা 💖
┃
┃ 🌷 আশা করি এখানে তুমি
┃ পাবে সুন্দর বন্ধুত্ব,
┃ আন্তরিক ভালোবাসা এবং
┃ অসংখ্য স্মরণীয় মুহূর্ত 🌷
┃
┃ ✨ প্রতিটি নতুন সদস্য
┃ আমাদের কাছে বিশেষ,
┃ আর আজ সেই বিশেষ মানুষটি
┃ তুমি @${user} ✨
┃
┃ 🤝 চল একসাথে তৈরি করি
┃ সুন্দর কিছু স্মৃতি,
┃ মজার কিছু আড্ডা এবং
┃ আনন্দে ভরা কিছু মুহূর্ত 🤝
┃
┃ 🌹 তোমার প্রতিটি দিন হোক
┃ সুখ, শান্তি এবং সফলতায় ভরা।
┃ আল্লাহ তোমার জীবনকে
┃ বরকতময় করে তুলুন 🕌
┃
┃ 💬 কোনো সাহায্যের প্রয়োজন হলে
┃ নির্দ্বিধায় জানাতে পারো,
┃ আমরা সবাই তোমার পাশে আছি 💬
┃
┃ ꧁💝 ❛❛ Feelings never fade 🦋 ❜❜ 💝꧂
┃ 💙 Some memories stay forever,
┃ even when people don't...
┃ 🌸 Every friendship starts with
┃ a simple hello and becomes
┃ a beautiful story someday ✨
┃
┃ 🩵━━━⋆★⋆━━━🩵
┃ 🌸 𝐓𝐡𝐚𝐧𝐤 𝐘𝐨𝐮 𝐅𝐨𝐫 𝐉𝐨𝐢𝐧𝐢𝐧𝐠 💖
┃ 🩷━━━⋆★⋆━━━🩷
┃
┃ 💞 তোমাকে জানাই
┃ আন্তরিক শুভেচ্ছা,
┃ অফুরন্ত ভালোবাসা
┃ এবং উষ্ণ অভিনন্দন 💞
┃
┃ 🌺 𝚂𝚃𝙰𝚈 𝚆𝙸𝚃𝙷 𝚄𝚂
┃ 🌺 𝙴𝙽𝙹𝙾𝚈 𝚈𝙾𝚄𝚁 𝚃𝙸𝙼𝙴
┃ 🌺 𝙷𝙰𝚅𝙴 𝙵𝚄𝙽 & 𝙼𝙰𝙺𝙴 𝙵𝚁𝙸𝙴𝙽𝙳𝚂
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`;
            await sock.sendMessage(
                id,
                {
                    image: {
                        url: profilePic
                    },

                    caption: finalMessage,

                    mentions: [
                        participantString
                    ],

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
