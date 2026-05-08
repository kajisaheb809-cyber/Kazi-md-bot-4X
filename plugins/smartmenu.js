import config from '../config.js';
import CommandHandler from '../lib/commandHandler.js';
import fs from 'fs';
import path from 'path';

const menuEmojis = ['✨', '🌟', '⭐', '💫', '🎯', '🎨', '🎪', '🎭'];
const activeEmojis = ['✅', '🟢', '💚', '✔️', '☑️'];
const disabledEmojis = ['❌', '🔴', '⛔', '🚫', '❎'];
const fastEmojis = ['⚡', '🚀', '💨', '⏱️', '🔥'];
const slowEmojis = ['🐢', '🐌', '⏳', '⌛', '🕐'];

const categoryEmojis = {
    general: ['📱', '🔧', '⚙️', '🛠️'],
    owner: ['👑', '🔱', '💎', '🎖️'],
    admin: ['🛡️', '⚔️', '🔐', '👮'],
    group: ['👥', '👫', '🧑‍🤝‍🧑', '👨‍👩‍👧‍👦'],
    download: ['📥', '⬇️', '💾', '📦'],
    ai: ['🤖', '🧠', '💭', '🎯'],
    search: ['🔍', '🔎', '🕵️', '📡'],
    apks: ['📲', '📦', '💿', '🗂️'],
    info: ['ℹ️', '📋', '📊', '📄'],
    fun: ['🎮', '🎲', '🎰', '🎪'],
    stalk: ['👀', '🔭', '🕵️', '🎯'],
    games: ['🎮', '🕹️', '🎯', '🏆'],
    images: ['🖼️', '📸', '🎨', '🌄'],
    menu: ['📜', '📋', '📑', '📚'],
    tools: ['🔨', '🔧', '⚡', '🛠️'],
    stickers: ['🎭', '😀', '🎨', '🖼️'],
    quotes: ['💬', '📖', '✍️', '💭'],
    music: ['🎵', '🎶', '🎧', '🎤'],
    utility: ['📂', '🔧', '⚙️', '🛠️']
};

function getRandomEmoji(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getCategoryEmoji(category) {
    const emojis = categoryEmojis[category.toLowerCase()] || ['📂', '📁', '🗂️', '📋'];
    return getRandomEmoji(emojis);
}

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: config.timeZone || 'UTC'
    });
}

export default {
    command: 'smenu',
    aliases: ['shelp', 'smart', 'help2'],
    category: 'general',
    description: 'Interactive smart menu with live status',
    usage: '.smenu',
    isPrefixless: true,

    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;

        try {

            // 🔥 IMAGE LINK (FIXED)
            const thumbnail = 'https://i.postimg.cc/DZpkCQff/Chat-GPT-Image-May-8-2026-12-38-34-PM.png';

            const categories = Array.from(CommandHandler.categories.keys());
            const stats = CommandHandler.getDiagnostics();

            const menuEmoji = getRandomEmoji(menuEmojis);
            const activeEmoji = getRandomEmoji(activeEmojis);
            const disabledEmoji = getRandomEmoji(disabledEmojis);
            const fastEmoji = getRandomEmoji(fastEmojis);
            const slowEmoji = getRandomEmoji(slowEmojis);

            let menuText = `${menuEmoji} *${config.botName || 'Kazi-md-bot-4X'}* ${menuEmoji}\n\n`;

            menuText += `┏━━━━━━━━━━━━━━━━┓\n`;
            menuText += `┃ 📱 *Bot:* ${config.botName || 'Kazi-md-bot-4X'}\n`;
            menuText += `┃ 🔖 *Version:* ${config.version || '6.0.0'}\n`;
            menuText += `┃ 👤 *Owner:* ${config.botOwner || 'Unknown'}\n`;
            menuText += `┃ ⏰ *Time:* ${formatTime()}\n`;
            menuText += `┃ ℹ️ *Prefix:* ${config.prefixes ? config.prefixes.join(', ') : '.'}\n`;
            menuText += `┃ 📊 *Plugins:* ${CommandHandler.commands.size}\n`;
            menuText += `┗━━━━━━━━━━━━━━━━┛\n\n`;

            const contextInfo = {
                forwardingScore: 1,
                isForwarded: true
            };

            const messageOptions = {
                image: { url: thumbnail },   // ✅ FIXED HERE
                caption: menuText,
                contextInfo
            };

            await sock.sendMessage(chatId, messageOptions, { quoted: message });

        } catch (error) {
            console.error('Menu Error:', error);
            await sock.sendMessage(chatId, {
                text: `❌ *Menu Error*\n\n${error.message}`
            }, { quoted: message });
        }
    }
};                    ` 
