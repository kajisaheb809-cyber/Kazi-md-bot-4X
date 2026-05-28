const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
    permission: 0,
    prefix: "both",
    categorie: "AI Chat",
    cooldowns: 5,
    credit: "Kazi-md-bot-4X",
    description: "AI Chat Bot System"
  },

  start: async function ({ api, event, args }) {
    const { threadId, message, senderId } = event;
    const usermsg = args.join(" ");

    if (!usermsg) {

      const greetings = [
        "🌸 আহ্ জান আমাকে ডাকছো কেনো 😚",
        "💖 কি গো সোনা, কিছু বলবা নাকি?",
        "🙄 এতবার ডাকো কেনো হুম?",
        "🥺 আসো না একটু গল্প করি",
        "😽 উম্মাহ তোমার জন্য অনেক ভালোবাসা",
        "🕌 আসসালামু আলাইকুম, কি করতে পারি তোমার জন্য?",
        "😒 বসকে একটা কফি দাও আগে তারপর কথা হবে",
        "🤭 আমারে মনে পড়ছে নাকি?",
        "😌 হুম জান বলো কি হয়েছে",
        "🌷 তোমার মেসেজ দেখলেই ভালো লাগে"
      ];

      const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

      const greetingText = `
╭━━━〔 🤖 𝘼𝙄 𝘽𝙊𝙏 🤖 〕━━━⬣

┃ 👤 𝙷𝙴𝚈 : @${senderId.split("@")[0]}
┃ 💌 ${randomGreeting}
┃
┃ 🌸 𝙺𝙰𝚉𝙸-𝙼𝙳-𝙱𝙾𝚃-4𝚇
┃ 💬 𝚈𝙾𝚄𝚁 𝚂𝙼𝙰𝚁𝚃 𝙲𝙷𝙰𝚃 𝙱𝙾𝚃
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`;

      const greetingMessage = await api.sendMessage(
        threadId,
        {
          text: greetingText,
          mentions: [senderId],
        },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: greetingMessage.key.id,
        type: "chat",
      });

      return;
    }

    try {

      const apis = await axios.get(
        "https://raw.githubusercontent.com/kajisaheb809-cyber/Kazi-md-bot-4X/main/api.json"
      );

      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(usermsg)}&number=${senderId.split("@")[0]}`
      );

      const replyText =
        response.data.data?.msg ||
        "🤖 আমি বুঝতে পারিনি আবার বলো।";

      const styledReply = `
╭━━━〔 🤖 𝘼𝙄 𝙍𝙀𝙋𝙇𝙔 🤖 〕━━━⬣

┃ 👤 @${senderId.split("@")[0]}
┃ 💬 ${replyText}
┃
┃ 🌸 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈
┃ 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇
┃
╰━━━〔 ✨ 𝘾𝙃𝘼𝙏 𝘽𝙊𝙏 ✨ 〕━━━⬣`;

      const sent = await api.sendMessage(
        threadId,
        {
          text: styledReply,
          mentions: [senderId],
        },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });

    } catch (err) {

      console.error("❌ Bot command error:", err);

      return api.sendMessage(
        threadId,
        {
          text: `
╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 ❌ 〕━━━⬣

┃ ⚠️ 𝚂𝙾𝙼𝙴𝚃𝙷𝙸𝙽𝙶 𝚆𝙴𝙽𝚃 𝚆𝚁𝙾𝙽𝙶
┃ 🔄 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽 𝙻𝙰𝚃𝙴𝚁
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`
        },
        { quoted: message }
      );
    }
  },

  handleReply: async function ({ api, event }) {

    const { threadId, message, body, senderId } = event;

    try {

      const apis = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json"
      );

      const apiss = apis.data.api;

      const response = await axios.get(
        `${apiss}/sim?type=ask&ask=${encodeURIComponent(body)}&number=${senderId.split("@")[0]}`
      );

      const replyText =
        response.data.data?.msg ||
        "🤖 আমি বুঝতে পারিনি আবার বলো।";

      const styledReply = `
╭━━━〔 🤖 𝘼𝙄 𝘾𝙃𝘼𝙏 🤖 〕━━━⬣

┃ 👤 @${senderId.split("@")[0]}
┃ 💬 ${replyText}
┃
┃ 🌸 𝚂𝚃𝙰𝚈 𝚆𝙸𝚃𝙷 𝚄𝚂
┃ 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇
┃
╰━━━〔 ✨ 𝘼𝙄 𝙎𝙔𝙎𝙏𝙀𝙈 ✨ 〕━━━⬣`;

      const sent = await api.sendMessage(
        threadId,
        {
          text: styledReply,
          mentions: [senderId],
        },
        { quoted: message }
      );

      global.client.handleReply.push({
        name: this.config.name,
        author: senderId,
        messageID: sent.key.id,
        type: "chat",
      });

    } catch (err) {

      console.error("❌ Error in bot handleReply:", err);

      return api.sendMessage(
        threadId,
        {
          text: `
╭━━━〔 ❌ 𝙀𝙍𝙍𝙊𝙍 ❌ 〕━━━⬣

┃ ⚠️ 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾
┃ 🔄 𝙲𝙾𝙽𝚃𝙸𝙽𝚄𝙴 𝙲𝙷𝙰𝚃
┃
╰━━━〔 💚 𝙺𝚊𝚣𝚒-𝚖𝚍-𝚋𝚘𝚝-4𝚇 💚 〕━━━⬣`
        },
        { quoted: message }
      );
    }
  }
};
