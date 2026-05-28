import axios from "axios";

export default {
  config: {
    name: "bot",
    aliases: ["sim"],
    permission: 0,
    prefix: false,
    category: "ai",
    cooldowns: 5,
    description: "AI Chat Bot"
  },

  async start({ sock, m, args }) {
    const sender =
      m.key.participant ||
      m.key.remoteJid;

    const senderNumber = sender.split("@")[0];
    const usermsg = args.join(" ");

    // Reply list
    const greetings = [
      "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ 😘",
      "কি গো সোনা আমাকে ডাকছ কেনো 😚",
      "বার বার আমাকে ডাকস কেন 😒",
      "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো 🥺",
      "হুম জান তোমার অইখানে উম্মমাহ 😘",
      "আসসালামু আলাইকুম 💚 বলেন কি করতে পারি?",
      "আমাকে এতো না ডেকে বসকে একটা gf দে 🙄",
      "জান হ্যাংআউট করবা নাকি 😌",
      "জান বাল ফালাবা 🙂"
    ];

    // No text
    if (!usermsg) {
      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text: `@${senderNumber} ${randomGreeting}`,
          mentions: [sender]
        },
        { quoted: m }
      );
    }

    try {
      // API LINK
      const api =
        `https://sim-api-3u1i.onrender.com/sim?query=${encodeURIComponent(usermsg)}`;

      const response = await axios.get(api);

      const reply =
        response.data.reply ||
        response.data.message ||
        "🤖 আমি বুঝতে পারিনি 😅";

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text: reply
        },
        { quoted: m }
      );

    } catch (err) {
      console.log(err);

      return await sock.sendMessage(
        m.key.remoteJid,
        {
          text: "❌ Bot বর্তমানে অফলাইনে আছে!"
        },
        { quoted: m }
      );
    }
  }
};
