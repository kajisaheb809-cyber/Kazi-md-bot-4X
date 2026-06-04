import axios from "axios";

export default {
command: "bot",
aliases: ["sim", "ai"],
category: "ai",
description: "AI Chat Bot",
usage: ".bot <message>",
isPrefixless: true,

```
async handler(sock, message, args) {
    const chatId = message.key.remoteJid;
    const sender =
        message.key.participant ||
        message.key.remoteJid;

    const senderNumber = sender.split("@")[0];
    const prompt = args.join(" ");

    const greetings = [
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ 😘",
        "কি গো সোনা আমাকে ডাকছ কেনো 😚",
        "বার বার আমাকে ডাকস কেন 😒",
        "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো 🥺",
        "হুম জান তোমার অইখানে উম্মমাহ 😘",
        "আসসালামু আলাইকুম 💚 বলেন আপনার জন্য কি করতে পারি?",
        "আমাকে এতো না ডেকে বসকে একটা gf দে 🙄",
        "জান হ্যাংআউট করবা নাকি 😌",
        "জান বাল ফালাবা 🙂"
    ];

    if (!prompt) {
        const randomGreeting =
            greetings[Math.floor(Math.random() * greetings.length)];

        return await sock.sendMessage(chatId, {
            text: `@${senderNumber} ${randomGreeting}`,
            mentions: [sender]
        });
    }

    try {
        const apiInfo = await axios.get(
            "https://raw.githubusercontent.com/kajisaheb809-cyber/Kazi-md-bot-4X/main/api.json"
        );

        const apiBase = apiInfo.data.api;

        const response = await axios.get(
            `${apiBase}/sim?type=ask&ask=${encodeURIComponent(prompt)}&number=${senderNumber}`
        );

        const reply =
            response.data?.data?.msg ||
            "🤖 আমি এর উত্তর খুঁজে পাইনি।";

        await sock.sendMessage(chatId, {
            text: reply
        });

    } catch (err) {
        console.error(err);

        await sock.sendMessage(chatId, {
            text: "❌ AI সার্ভারে কানেক্ট করা যাচ্ছে না!"
        });
    }
}
```

};
