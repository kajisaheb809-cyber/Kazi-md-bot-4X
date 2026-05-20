import { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } from '../lib/index.js';
async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📥 *Welcome Message Setup*\n\n✅ *.welcome on* — Enable welcome messages\n🛠️ *.welcome set Your custom message* — Set a custom welcome message\n🚫 *.welcome off* — Disable welcome messages\n\n*Available Variables:*\n• {user} - Mentions the new member\n• {group} - Shows group name\n• {description} - Shows group description`,
            quoted: message
        });
    }
    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');
    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ Welcome messages are *already enabled*.', quoted: message });
        }
        await addWelcome(chatId, true, '`╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮\n┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: {user} to {group}! * ✨🎉\n\n` +
        `🚀 You just landed in an awesome group!\n` +
        `👥 *Total Members:* ${totalMembers}\n╰━━━━━━━━━━━━━━━╯\n\n` + 
        `📢 *🕌 *السلام عليكم ورحمة الله وبركاته*
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
🌺 *May Allah bless our gathering and make it a source of benefit for all of us. Ameen!* 🌺
🌺*ᴘᴏᴡᴇʀᴇᴅ ʙʏ Kazi-md-bot-4X*`;');
        return sock.sendMessage(chatId, { text: '✅ Welcome messages *enabled* with simple message. Use *.welcome set [your message]* to customize.', quoted: message });
    }
    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ Welcome messages are *already disabled*.', quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: '✅ Welcome messages *disabled* for this group.', quoted: message });
    }
    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Please provide a custom welcome message. Example: *.welcome set Welcome to the group!*', quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Custom welcome message *set successfully*.', quoted: message });
    }
    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Invalid command. Use:\n*.welcome on* - Enable\n*.welcome set [message]* - Set custom message\n*.welcome off* - Disable`,
        quoted: message
    });
}
async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📤 *Goodbye Message Setup*\n\n✅ *.goodbye on* — Enable goodbye messages\n🛠️ *.goodbye set Your custom message* — Set a custom goodbye message\n🚫 *.goodbye off* — Disable goodbye messages\n\n*Available Variables:*\n• {user} - Mentions the leaving member\n• {group} - Shows group name`,
            quoted: message
        });
    }
    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ Goodbye messages are *already enabled*.', quoted: message });
        }
        await addGoodbye(chatId, true, 'Goodbye {user} 👋');
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages *enabled* with simple message. Use *.goodbye set [your message]* to customize.', quoted: message });
    }
    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ Goodbye messages are *already disabled*.', quoted: message });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, { text: '✅ Goodbye messages *disabled* for this group.', quoted: message });
    }
    if (lower.startsWith('set ')) {
        const customMessage = match.substring(4);
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ Please provide a custom goodbye message. Example: *.goodbye set Goodbye!*', quoted: message });
        }
        await addGoodbye(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ Custom goodbye message *set successfully*.', quoted: message });
    }
    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ Invalid command. Use:\n*.goodbye on* - Enable\n*.goodbye set [message]* - Set custom message\n*.goodbye off* - Disable`,
        quoted: message
    });
}
export { handleWelcome, handleGoodbye };
// This code handles welcome and goodbye messages in a WhatsApp group using the Baileys library.
