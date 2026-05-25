import { handleGoodbye } from '../lib/welcome.js';
import { isGoodByeOn, getGoodbye } from '../lib/index.js';
async function handleLeaveEvent(sock, id, participants) {
    const isGoodbyeEnabled = await isGoodByeOn(id);
    if (!isGoodbyeEnabled)
        return;
    const customMessage = await getGoodbye(id);
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
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
                    .replace(/{group}/g, groupName);
            }
            else {
                finalMessage = `*@${displayName}*বিদায় @${userJid} 👋। সিস্টেম থেকে একজন দুর্বল মেম্বার রিমুভ হলো।`,
                `@${userJid} গেট আউট! এই গ্রুপে থাকার যোগ্যতা সবার থাকে না। 💀`,
                `অযথা ভিড় কমিয়ে দেওয়ার জন্য ধন্যবাদ @${userJid}। ভালো থেকো। 🔱`,
                `টা-টা @${userJid}! যাওয়ার সময় গেটটা টেনে দিয়ে যেও, বাতাস আসছে। 💨`,
                `অবশেষে @${userJid} পালিয়েছে! গ্রুপটা এখন একটু শান্ত হবে। 😂`,
                `@${userJid} বিদায় বন্ধু! সাবধানে যেও, রাস্তায় আবার হোঁচট খেও না। 🏃‍♂️`,
                `গেম ওভার @${userJid}! তোমার চ্যাপ্টার এখানেই শেষ। 🚫`,
                `@${userJid} লিভ নিল নাকি কিক খেলো? যাই হোক, আপদ বিদায় হলো! ✌️`,
                `বিদায় @${userJid}। তোমার অভাব আমরা একদমই অনুভব করবো না। 💀🚀`,
                `আহা! @${userJid} বিদায় নিল। আবর্জনা পরিষ্কার হওয়ায় গ্রুপটা ফ্রেশ লাগছে। ✨`,
                `@${userJid} চলে গেল? যাক, গ্রুপের গড় আইকিউ (IQ) এক লাফে বেড়ে গেল! 🧠🔥`,
                `বেশি ডানা গজিয়েছিল @${userJid}-এর, তাই আকাশ থেকে ছিটকে পড়লো। 🕊️❌`,
                `পাগল বিদায় হলো, দুনিয়া শান্ত হলো। @${userJid} টা-টা! 🤡👋`,
                `এই গ্রুপের রাজকীয় ভাইব সহ্য করার ক্ষমতা তোমার ছিল না @${userJid}। 👑`,
                `আরেকটা ফালতু প্লেয়ার এলিমিনেট হলো। সিস্টেম ক্লিনিং কমপ্লিট! @${userJid} ☣️`,
                `@${userJid} বিদায়! যাওয়ার আগে কান্না করার জন্য টিস্যু দিয়ে যাবো? 🧻🤣`,
                `যাও @${userJid}, গিয়ে অন্য কোথাও!`;
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
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming1?type=leave&textcolor=red&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = Buffer.from(await response.arrayBuffer());
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString]
                    });
                    continue;
                }
            }
            catch (imageError) {
                console.log('Image generation failed, falling back to text');
            }
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString]
            });
        }
        catch (error) {
            console.error('Error sending goodbye message:', error);
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            let fallbackMessage;
            if (customMessage) {
                fallbackMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName);
            }
            else {
                fallbackMessage = `Goodbye @${user}! 👋`;
            }
            await sock.sendMessage(id, {
                text: fallbackMessage,
                mentions: [participantString]
            });
        }
    }
}
export default {
    command: 'goodbye',
    aliases: ['bye', 'leave'],
    category: 'admin',
    description: 'Configure goodbye messages for leaving members',
    usage: '.goodbye <on|off|set message>',
    groupOnly: true,
    adminOnly: true,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const matchText = args.join(' ');
        await handleGoodbye(sock, chatId, message, matchText);
    },
    handleLeaveEvent
};
