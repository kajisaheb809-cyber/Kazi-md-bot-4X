import fs from 'fs';
import path from 'path';
import { dataFile } from '../lib/paths.js';
import store from '../lib/lightweight_store.js';

const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;

const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);

const USER_GROUP_DATA = dataFile('userGroupData.json');

const MAX_MEMORY = 10;

const repliedMessages = new Set();

const chatMemory = {
  messages: new Map(),
  userInfo: new Map()
};

const API_ENDPOINTS = [
  {
    name: 'ZellAPI',
    url: (text) =>
      `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(text)}`,
    parse: (data) => data?.result
  },
  {
    name: 'Hercai',
    url: (text) =>
      `https://hercai.onrender.com/gemini/hercai?question=${encodeURIComponent(text)}`,
    parse: (data) => data?.reply
  },
  {
    name: 'SparkAPI',
    url: (text) =>
      `https://discardapi.dpdns.org/api/chat/spark?apikey=guru&text=${encodeURIComponent(text)}`,
    parse: (data) => data?.result?.answer
  },
  {
    name: 'LlamaAPI',
    url: (text) =>
      `https://discardapi.dpdns.org/api/bot/llama?apikey=guru&text=${encodeURIComponent(text)}`,
    parse: (data) => data?.result
  }
];

async function loadUserGroupData() {
  try {
    if (HAS_DB) {
      const data = await store.getSetting('global', 'userGroupData');
      return data || { groups: [], chatbot: {} };
    }

    return JSON.parse(fs.readFileSync(USER_GROUP_DATA, 'utf-8'));
  } catch (error) {
    console.error('Error loading data:', error.message);
    return { groups: [], chatbot: {} };
  }
}

async function saveUserGroupData(data) {
  try {
    if (HAS_DB) {
      await store.saveSetting('global', 'userGroupData', data);
    } else {
      const dataDir = path.dirname(USER_GROUP_DATA);

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error saving data:', error.message);
  }
}

function getRandomDelay() {
  return Math.floor(Math.random() * 2000) + 1000;
}

async function showTyping(sock, chatId) {
  try {
    await sock.presenceSubscribe(chatId);
    await sock.sendPresenceUpdate('composing', chatId);

    await new Promise((resolve) =>
      setTimeout(resolve, getRandomDelay())
    );
  } catch (error) {
    console.error('Typing error:', error.message);
  }
}

function extractUserInfo(message) {
  const info = {};

  if (message.toLowerCase().includes('my name is')) {
    info.name = message
      .split('my name is')[1]
      ?.trim()
      ?.split(' ')[0];
  }

  if (
    message.toLowerCase().includes('i am') &&
    message.toLowerCase().includes('years old')
  ) {
    info.age = message.match(/\d+/)?.[0];
  }

  return info;
}

async function getAIResponse(userMessage, userContext) {
  const prompt = `
You are a friendly WhatsApp group member.

RULES:
1. Always reply in Bangla
2. Keep replies short and natural
3. Talk like a real human
4. Use emoji naturally
5. Never say you are AI
6. Be funny and smart

PERSONALITY:
- Your name is Kazi-md-bot-4X
- You are friendly
- You roast jokingly
- You support sad people
- You joke with funny users

Previous chat:
${userContext.messages.join('\n')}

User info:
${JSON.stringify(userContext.userInfo)}

User: ${userMessage}
You:
`.trim();

  for (const api of API_ENDPOINTS) {
    try {
      console.log(`Trying ${api.name}`);

      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);

      const response = await fetch(api.url(prompt), {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data = await response.json();

      const result = api.parse(data);

      if (!result) continue;

      console.log(`${api.name} success`);

      return result
        .trim()
        .replace(/Google AI/gi, 'Kazi-md-bot-4X')
        .replace(/language model/gi, 'human')
        .replace(/AI/gi, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+|\s+$/g, '');
    } catch (error) {
      console.log(`${api.name} failed: ${error.message}`);
      continue;
    }
  }

  return 'আরে একটু পরে বলো 😅';
}

export async function handleChatbotResponse(
  sock,
  chatId,
  message,
  userMessage,
  senderId
) {
  try {
    const data = await loadUserGroupData();

    if (!data.chatbot[chatId]) return;

    const msgId = message.key.id;

    if (repliedMessages.has(msgId)) return;

    repliedMessages.add(msgId);

    setTimeout(() => {
      repliedMessages.delete(msgId);
    }, 60000);

    const botId = sock.user.id;

    const botNumber = botId.split(':')[0];

    const isGroup = chatId.endsWith('@g.us');

    if (!isGroup) return;

    if (senderId.includes(botNumber)) return;

    if (!chatMemory.messages.has(senderId)) {
      chatMemory.messages.set(senderId, []);
      chatMemory.userInfo.set(senderId, {});
    }

    const userInfo = extractUserInfo(userMessage);

    if (Object.keys(userInfo).length > 0) {
      chatMemory.userInfo.set(senderId, {
        ...chatMemory.userInfo.get(senderId),
        ...userInfo
      });
    }

    const messages = chatMemory.messages.get(senderId);

    messages.push(userMessage);

    if (messages.length > MAX_MEMORY) {
      messages.shift();
    }

    chatMemory.messages.set(senderId, messages);

    await showTyping(sock, chatId);

    const aiReply = await getAIResponse(userMessage, {
      messages: chatMemory.messages.get(senderId),
      userInfo: chatMemory.userInfo.get(senderId)
    });

    if (!aiReply) return;

    await sock.sendMessage(
      chatId,
      {
        text: aiReply
      },
      {
        quoted: message
      }
    );
  } catch (error) {
    console.error('Chatbot Error:', error.message);
  }
}

export default {
  command: 'chatbot',
  aliases: ['bot', 'ai'],
  category: 'group',
  description: 'Enable or disable chatbot',
  usage: '.chatbot on/off',
  adminOnly: true,
  groupOnly: true,

  async handler(sock, message, args, context) {
    const chatId = context.chatId || message.key.remoteJid;

    const input = args.join(' ').toLowerCase();

    const data = await loadUserGroupData();

    if (!input) {
      return sock.sendMessage(
        chatId,
        {
          text:
            `🤖 *CHATBOT SYSTEM*\n\n` +
            `• .chatbot on\n` +
            `• .chatbot off\n\n` +
            `যখন অন থাকবে তখন সবাই কথা বললে বট রিপ্লাই দিবে 😄`
        },
        {
          quoted: message
        }
      );
    }

    if (input === 'on') {
      if (data.chatbot[chatId]) {
        return sock.sendMessage(
          chatId,
          {
            text: '⚠️ Chatbot আগে থেকেই অন আছে'
          },
          {
            quoted: message
          }
        );
      }

      data.chatbot[chatId] = true;

      await saveUserGroupData(data);

      return sock.sendMessage(
        chatId,
        {
          text:
            '✅ Chatbot অন হয়েছে\n\nএখন গ্রুপের সবাই কথা বললে আমি রিপ্লাই দিব 😄'
        },
        {
          quoted: message
        }
      );
    }

    if (input === 'off') {
      if (!data.chatbot[chatId]) {
        return sock.sendMessage(
          chatId,
          {
            text: '⚠️ Chatbot আগে থেকেই অফ আছে'
          },
          {
            quoted: message
          }
        );
      }

      delete data.chatbot[chatId];

      await saveUserGroupData(data);

      return sock.sendMessage(
        chatId,
        {
          text: '❌ Chatbot বন্ধ করা হয়েছে'
        },
        {
          quoted: message
        }
      );
    }

    return sock.sendMessage(
      chatId,
      {
        text: '❌ Use: .chatbot on/off'
      },
      {
        quoted: message
      }
    );
  },

  handleChatbotResponse,
  loadUserGroupData,
  saveUserGroupData
};
