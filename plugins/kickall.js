export default {
    command: 'kickall',
    aliases: ['kickeveryone'],
    category: 'admin',
    description: 'Kick all non-admin members',
    usage: '.kickall',
    groupOnly: true,
    adminOnly: true,

    async handler(sock, message, args, context) {
        try {
            const chatId = context.chatId || message.key.remoteJid;
            const isBotAdmin = context.isBotAdmin;

            if (!isBotAdmin) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Bot কে আগে admin বানাও*'
                }, { quoted: message });
            }

            const metadata = await sock.groupMetadata(chatId);
            const participants = metadata.participants;

            // Admin list
            const admins = participants
                .filter(p => p.admin)
                .map(p => p.id);

            // Bot number
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

            // Targets
            const usersToKick = participants
                .filter(p =>
                    !admins.includes(p.id) &&
                    p.id !== botNumber
                )
                .map(p => p.id);

            if (usersToKick.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Kick দেওয়ার মতো member পাওয়া যায়নি*'
                }, { quoted: message });
            }

            await sock.sendMessage(chatId, {
                text: `⚠️ *${usersToKick.length} জন member remove করা হচ্ছে...*`
            }, { quoted: message });

            // Remove all members
            for (const user of usersToKick) {
                try {
                    await sock.groupParticipantsUpdate(
                        chatId,
                        [user],
                        'remove'
                    );

                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (err) {
                    console.log(`Failed to remove ${user}`);
                }
            }

            await sock.sendMessage(chatId, {
                text: '✅ *Successfully kicked all non-admin members!*'
            }, { quoted: message });

        } catch (error) {
            console.log(error);

            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ *Error kicking members!*'
            }, { quoted: message });
        }
    }
};
