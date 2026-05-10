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

            // Bot admin check
            if (!context.isBotAdmin) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Bot কে আগে admin বানাও!*'
                }, { quoted: message });
            }

            // Group metadata
            const metadata = await sock.groupMetadata(chatId);
            const participants = metadata.participants;

            // Admin list
            const admins = participants
                .filter(p => p.admin)
                .map(p => p.id);

            // Bot number
            const botNumber =
                sock.user.id.split(':')[0] + '@s.whatsapp.net';

            // Users to kick
            const usersToKick = participants
                .filter(p =>
                    !admins.includes(p.id) &&
                    p.id !== botNumber
                )
                .map(p => p.id);

            // No users found
            if (usersToKick.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Kick দেওয়ার মতো member পাওয়া যায়নি!*'
                }, { quoted: message });
            }

            // Remove all together
            await sock.groupParticipantsUpdate(
                chatId,
                usersToKick,
                'remove'
            );

            // Success message
            await sock.sendMessage(chatId, {
                text: `✅ Successfully kicked all members!\n\n⚠️ ${usersToKick.length} জন member remove করা হয়েছে!`
            }, { quoted: message });

        } catch (error) {
            console.log(error);

            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ *Error kicking members!*'
            }, { quoted: message });
        }
    }
};
