/**
 * SetMenuImage Command - Owner only
 * ES Module Fixed Version
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'setmenuimage',
  aliases: ['setmenuimg', 'changemenuimage'],
  category: 'owner',
  description: 'Set or change the menu image (owner only)',
  usage: '.setmenuimage (reply to image/sticker)',
  ownerOnly: true,
  adminOnly: false,
  groupOnly: false,
  botAdminOnly: false,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;

      // Check reply message
      const ctx = msg.message?.extendedTextMessage?.contextInfo;

      if (!ctx?.quotedMessage) {
        return extra.reply(
          '📷 Please reply to an image or sticker.'
        );
      }

      const quotedMsg = ctx.quotedMessage;

      const imageMsg =
        quotedMsg.imageMessage ||
        quotedMsg.stickerMessage;

      if (!imageMsg) {
        return extra.reply(
          '❌ Reply must contain image or sticker.'
        );
      }

      // Target message
      const targetMessage = {
        key: {
          remoteJid: chatId,
          id: ctx.stanzaId,
          participant: ctx.participant,
        },
        message: quotedMsg,
      };

      // Download media
      const mediaBuffer = await downloadMediaMessage(
        targetMessage,
        'buffer',
        {},
        {
          logger: undefined,
          reuploadRequest: sock.updateMediaMessage,
        }
      );

      if (!mediaBuffer) {
        return extra.reply(
          '❌ Failed to download media.'
        );
      }

      let finalBuffer = mediaBuffer;

      // Convert sticker/webp/png to jpg
      if (
        quotedMsg.stickerMessage ||
        !imageMsg.mimetype?.includes('jpeg')
      ) {
        finalBuffer = await sharp(mediaBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      // Save image
      const imagePath = path.join(
        __dirname,
        '../../utils/bot_image.jpg'
      );

      // Delete old image
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Write new image
      fs.writeFileSync(imagePath, finalBuffer);

      await extra.reply(
        '✅ Menu image updated successfully!'
      );

    } catch (error) {
      console.error(
        'SetMenuImage Error:',
        error
      );

      await extra.reply(
        `❌ Error: ${error.message}`
      );
    }
  },
};
