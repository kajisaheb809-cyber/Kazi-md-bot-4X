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
    if (!isWelcomeEnabled)
        return;
    const customMessage = await getWelcome(id);
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const totalMembers = groupMetadata.Total|| 'No totalMembers available';
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
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            let displayName = user;
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                }
                else {
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find((p) => p.id === participantString);
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            }
            catch (nameError) {
                console.log('Could not fetch display name, using phone number');
            }
            let finalMessage;
            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{Total Members}/g, totalMembers);
            }
            else {
                const now = new Date();
                const timeString = now.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                finalMessage = `╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @${displayName} 👋\n┃Member count: #${groupMetadata.participants.length}\n┃𝚃𝙸𝙼𝙴: ${timeString}⏰\n╰━━━━━━━━━━━━━━━╯\n\n*@${displayName}* Welcome to *${groupName}*! 🎉\n*Total Members:*\n${totalMembers}\n\n> 🕌 *السلام عليكم ورحمة الله وبركاته*
✨ *Assalamualaikum Warahmatullahi Wabarakatuh* ✨

*🌸💫 Dear New Member, Welcome to Our Group*

*তোমাকে পারমিশন ছাড়া অ্যাড দেওয়ার জন্য সত্যিই দুঃখিত 🥺*
*তবে এখন যখন চলে এসেছো, আমাদের সাথেই থেকো 💬*
*ফ্রি টাইমে আড্ডা দাও, মজা করো, চিল করো*
*— কারণ এই জায়গাটাই ভরা পজিটিভ ভাইবে 💖*

*আজ আছি, কাল থাকবো কি না কে জানে 🙃*
*যদি কখনো কোনো ভুল করি, ক্ষমার চোখে দেখো 🤲🫂*

*আর হ্যাঁ ☕*
*আমার পক্ষ থেকে তোমার জন্য স্পেশাল*
*চায়ের দাওয়াত রইলো! 😋*
*Enjoy করো, হাসো, আর মন খুলে সবাইকে*
*আপন করে নাও 💬💞*

*— 🌿✨ Aᴅᴍɪɴ ᴛᴇᴀᴍ ✨🌿*

.........................................................
-----------------------------------------
🌺 *May Allah bless our gathering and make it a source of benefit for all of us. Ameen!*

🌺*ᴘᴏᴡᴇʀᴇᴅ ʙʏ Kazi-md-bot-4X*`;
            }
            try {
                let profilePicUrl = `https://img.pyrocdn.com/dbKUgahg.png`;
                try {
                    const profilePic = await sock.profilePictureUrl(participantString, 'image');
                    if (profilePic) {
                        profilePicUrl = profilePic;
                    }
                }
                catch (profileError) {
                    console.log('Could not fetch profile picture, using default');
                }
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = Buffer.from(await response.arrayBuffer());
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo
                    });
                    continue;
                }
            }
            catch (imageError) {
                console.log('Image generation failed, falling back to text');
            }
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo
            });
        }
        catch (error) {
            console.error('Error sending welcome message:', error);
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            let fallbackMessage;
            if (customMessage) {
                fallbackMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{Total Members}/g, totalMembers);
            }
            else {
                fallbackMessage = `Welcome @${user} to ${groupName}! 🎉`;
            }
            await sock.sendMessage(id, {
                text: fallbackMessage,
                mentions: [participantString],
                ...channelInfo
            });
        }
    }
}
export { handleJoinEvent };
