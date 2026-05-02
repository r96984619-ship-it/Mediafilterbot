import asyncio
import logging
from pyrogram import Client, filters, enums
from pyrogram.types import Message
from database.users_chats_db import db
from utils import broadcast_messages
from info import ADMINS

logger = logging.getLogger(__name__)


@Client.on_message(filters.command('broadcast') & filters.user(ADMINS))
async def broadcast(bot: Client, message: Message):
    if message.reply_to_message:
        sts = await message.reply_text("Broadcasting...")
        users = await db.get_all_users()
        b_msg = message.reply_to_message
        done = 0
        blocked = 0
        deleted = 0
        failed = 0
        success = 0
        async for user in users:
            pprint, result = await broadcast_messages(int(user['id']), b_msg)
            if pprint:
                success += 1
            elif result == "Blocked":
                blocked += 1
            elif result == "Deleted":
                deleted += 1
            elif result == "Error":
                failed += 1
            done += 1
            if not done % 20:
                await sts.edit(
                    f"<b>Broadcast in progress:</b>\n\n"
                    f"Total users: <code>{done}</code>\n"
                    f"Success: <code>{success}</code>\n"
                    f"Blocked: <code>{blocked}</code>\n"
                    f"Deleted: <code>{deleted}</code>\n"
                    f"Failed: <code>{failed}</code>"
                )
        await sts.edit(
            f"<b>Broadcast Complete!</b>\n\n"
            f"Total users: <code>{done}</code>\n"
            f"Success: <code>{success}</code>\n"
            f"Blocked: <code>{blocked}</code>\n"
            f"Deleted: <code>{deleted}</code>\n"
            f"Failed: <code>{failed}</code>"
        )
    else:
        await message.reply_text("Reply to a message to broadcast it.")


@Client.on_message(filters.command('grp_broadcast') & filters.user(ADMINS))
async def broadcast_to_chats(bot: Client, message: Message):
    if message.reply_to_message:
        sts = await message.reply_text("Broadcasting to groups...")
        chats = await db.get_all_chats()
        b_msg = message.reply_to_message
        done = 0
        failed = 0
        success = 0
        async for chat in chats:
            try:
                await b_msg.copy(chat_id=int(chat['id']))
                success += 1
            except Exception:
                failed += 1
            done += 1
            if not done % 10:
                await sts.edit(
                    f"<b>Group Broadcast in progress:</b>\n\n"
                    f"Done: <code>{done}</code>\n"
                    f"Success: <code>{success}</code>\n"
                    f"Failed: <code>{failed}</code>"
                )
            await asyncio.sleep(0.5)
        await sts.edit(
            f"<b>Group Broadcast Complete!</b>\n\n"
            f"Total: <code>{done}</code>\n"
            f"Success: <code>{success}</code>\n"
            f"Failed: <code>{failed}</code>"
        )
    else:
        await message.reply_text("Reply to a message to broadcast to groups.")
