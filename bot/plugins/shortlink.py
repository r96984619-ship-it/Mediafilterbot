import logging
import time
from pyrogram import Client, filters
from pyrogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from info import ADMINS, SHORTLINK_URL, SHORTLINK_API, VERIFY_EXPIRE
from utils import get_shortlink, temp

logger = logging.getLogger(__name__)

# ── Admin commands ────────────────────────────────────────────────────────────

@Client.on_message(filters.command('shortlink') & filters.user(ADMINS))
async def set_shortlink(bot, message):
    parts = message.text.strip().split(None, 2)
    if len(parts) < 3:
        return await message.reply(
            "**Usage:** `/shortlink <site_url> <api_key>`\n\n"
            "**Example:**\n`/shortlink mdisk.me YOUR_API_KEY`\n\n"
            "Get your API key from your shortener website dashboard.",
            parse_mode="markdown"
        )
    _, url, api = parts
    if not url.startswith('http'):
        url = 'https://' + url
    import os
    os.environ['SHORTLINK_URL'] = url
    os.environ['SHORTLINK_API'] = api
    # Reload in info
    import info as _info
    _info.SHORTLINK_URL = url
    _info.SHORTLINK_API = api
    await message.reply(
        f"✅ **Shortlink set!**\n\n"
        f"🌐 Site: `{url}`\n"
        f"🔑 API: `{api[:6]}...`\n\n"
        f"Users will now go through your shortlink to earn money!",
        parse_mode="markdown"
    )


@Client.on_message(filters.command('shortlink2') & filters.user(ADMINS))
async def set_shortlink2(bot, message):
    parts = message.text.strip().split(None, 2)
    if len(parts) < 3:
        return await message.reply("**Usage:** `/shortlink2 <site_url> <api_key>`", parse_mode="markdown")
    _, url, api = parts
    if not url.startswith('http'):
        url = 'https://' + url
    import os, info as _info
    os.environ['SHORTLINK_URL2'] = url
    os.environ['SHORTLINK_API2'] = api
    _info.SHORTLINK_URL2 = url
    _info.SHORTLINK_API2 = api
    await message.reply(f"✅ **Shortlink 2 set!** Site: `{url}`", parse_mode="markdown")


@Client.on_message(filters.command('shortlink3') & filters.user(ADMINS))
async def set_shortlink3(bot, message):
    parts = message.text.strip().split(None, 2)
    if len(parts) < 3:
        return await message.reply("**Usage:** `/shortlink3 <site_url> <api_key>`", parse_mode="markdown")
    _, url, api = parts
    if not url.startswith('http'):
        url = 'https://' + url
    import os, info as _info
    os.environ['SHORTLINK_URL3'] = url
    os.environ['SHORTLINK_API3'] = api
    _info.SHORTLINK_URL3 = url
    _info.SHORTLINK_API3 = api
    await message.reply(f"✅ **Shortlink 3 set!** Site: `{url}`", parse_mode="markdown")


@Client.on_message(filters.command('tutorial') & filters.user(ADMINS))
async def set_tutorial(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/tutorial <video_url>`\n\nThis video is shown to users explaining how to bypass the shortlink.", parse_mode="markdown")
    url = parts[1].strip()
    import os, info as _info
    os.environ['VERIFY_TUTORIAL'] = url
    _info.VERIFY_TUTORIAL = url
    await message.reply(f"✅ **Tutorial video set!**\n`{url}`", parse_mode="markdown")


@Client.on_message(filters.command('tutorial2') & filters.user(ADMINS))
async def set_tutorial2(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/tutorial2 <video_url>`", parse_mode="markdown")
    url = parts[1].strip()
    import os, info as _info
    os.environ['VERIFY_TUTORIAL2'] = url
    _info.VERIFY_TUTORIAL2 = url
    await message.reply(f"✅ **Tutorial 2 set!**\n`{url}`", parse_mode="markdown")


@Client.on_message(filters.command('tutorial3') & filters.user(ADMINS))
async def set_tutorial3(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/tutorial3 <video_url>`", parse_mode="markdown")
    url = parts[1].strip()
    import os, info as _info
    os.environ['VERIFY_TUTORIAL3'] = url
    _info.VERIFY_TUTORIAL3 = url
    await message.reply(f"✅ **Tutorial 3 set!**\n`{url}`", parse_mode="markdown")


@Client.on_message(filters.command('set_log') & filters.user(ADMINS))
async def set_log_channel(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/set_log <channel_id>`", parse_mode="markdown")
    try:
        ch_id = int(parts[1].strip())
        import os, info as _info
        os.environ['LOG_CHANNEL'] = str(ch_id)
        _info.LOG_CHANNEL = ch_id
        await message.reply(f"✅ **Log channel set to** `{ch_id}`", parse_mode="markdown")
    except ValueError:
        await message.reply("❌ Channel ID must be a number like `-1001234567890`")


@Client.on_message(filters.command('set_caption') & filters.user(ADMINS))
async def set_caption(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply(
            "**Usage:** `/set_caption <caption>`\n\n"
            "**Variables you can use:**\n"
            "`{file_name}` — file name\n"
            "`{file_size}` — file size\n"
            "`{file_caption}` — original caption\n\n"
            "**Example:**\n`/set_caption 🎬 {file_name}\n📦 Size: {file_size}\n\n@backupchannek`",
            parse_mode="markdown"
        )
    caption = parts[1].strip()
    import os, info as _info
    os.environ['CUSTOM_FILE_CAPTION'] = caption
    _info.CUSTOM_FILE_CAPTION = caption
    await message.reply(f"✅ **Custom caption set!**\n\n`{caption}`", parse_mode="markdown")


@Client.on_message(filters.command('set_template') & filters.user(ADMINS))
async def set_imdb_template(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply(
            "**Usage:** `/set_template <template>`\n\n"
            "Use `{title}`, `{year}`, `{rating}`, `{genres}`, `{url}`, `{plot}` as placeholders.",
            parse_mode="markdown"
        )
    template = parts[1].strip()
    import os, info as _info
    os.environ['IMDB_TEMPLATE'] = template
    _info.IMDB_TEMPLATE = template
    await message.reply(f"✅ **IMDB template updated!**", parse_mode="markdown")


@Client.on_message(filters.command('fsu') & filters.user(ADMINS))
async def set_force_sub(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply(
            "**Usage:** `/fsu <channel_id or @username>`\n\n"
            "Users must join this channel before getting files.\n"
            "Make sure bot is admin in the channel!",
            parse_mode="markdown"
        )
    ch = parts[1].strip()
    try:
        if ch.lstrip('-').isdigit():
            ch_val = int(ch)
        else:
            ch_val = ch.lstrip('@')
        import os, info as _info
        os.environ['AUTH_CHANNEL'] = str(ch_val)
        _info.AUTH_CHANNEL = ch_val
        await message.reply(f"✅ **Force subscribe enabled!**\nChannel: `{ch_val}`\n\nUsers must join before getting files.", parse_mode="markdown")
    except Exception as e:
        await message.reply(f"❌ Error: {e}")


@Client.on_message(filters.command('del_fsub') & filters.user(ADMINS))
async def remove_force_sub(bot, message):
    import os, info as _info
    os.environ['AUTH_CHANNEL'] = ''
    _info.AUTH_CHANNEL = None
    await message.reply("✅ **Force subscribe removed!** Users can now get files without joining.", parse_mode="markdown")


@Client.on_message(filters.command('show_fsub') & filters.user(ADMINS))
async def show_force_sub(bot, message):
    import info as _info
    ch = _info.AUTH_CHANNEL
    if ch:
        try:
            chat = await bot.get_chat(ch)
            await message.reply(f"✅ **Force Sub is ON**\nChannel: **{chat.title}**\nID: `{ch}`", parse_mode="markdown")
        except Exception:
            await message.reply(f"✅ **Force Sub is ON**\nChannel ID: `{ch}`", parse_mode="markdown")
    else:
        await message.reply("❌ **Force Sub is OFF** — no channel set.")


@Client.on_message(filters.command('ginfo') & filters.user(ADMINS))
async def group_info(bot, message):
    if message.chat.type in ['private']:
        return await message.reply("Use this command in a group.")
    chat = message.chat
    try:
        members = await bot.get_chat_members_count(chat.id)
    except Exception:
        members = "Unknown"
    text = (
        f"**Group Info**\n\n"
        f"📛 Name: **{chat.title}**\n"
        f"🆔 ID: `{chat.id}`\n"
        f"👥 Members: **{members}**\n"
        f"🔗 Username: @{chat.username or 'private'}"
    )
    await message.reply(text, parse_mode="markdown")


@Client.on_message(filters.command('premium') & filters.user(ADMINS))
async def grant_premium(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/premium <user_id>`", parse_mode="markdown")
    try:
        uid = int(parts[1].strip())
        from utils import temp
        temp.PREMIUM_USERS.add(uid)
        await message.reply(f"⭐️ **Premium granted to** `{uid}`\nThey now get files without verification.", parse_mode="markdown")
    except ValueError:
        await message.reply("❌ User ID must be a number.")


@Client.on_message(filters.command('unpremium') & filters.user(ADMINS))
async def remove_premium(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/unpremium <user_id>`", parse_mode="markdown")
    try:
        uid = int(parts[1].strip())
        from utils import temp
        temp.PREMIUM_USERS.discard(uid)
        await message.reply(f"🗑 **Premium removed from** `{uid}`", parse_mode="markdown")
    except ValueError:
        await message.reply("❌ User ID must be a number.")


@Client.on_message(filters.command('set_sub_link') & filters.user(ADMINS))
async def set_sub_link(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/set_sub_link <url>`\n\nUsers see this as the 'Buy Subscription' button.", parse_mode="markdown")
    url = parts[1].strip()
    import os, info as _info
    os.environ['SUB_LINK'] = url
    _info.SUB_LINK = url
    await message.reply(f"✅ **Subscription link set!**\n`{url}`", parse_mode="markdown")


@Client.on_message(filters.command('set_movie_group') & filters.user(ADMINS))
async def set_movie_group(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply("**Usage:** `/set_movie_group <url or @username>`\n\nThis is the group shown when users text the bot in PM.", parse_mode="markdown")
    url = parts[1].strip()
    if not url.startswith('http') and not url.startswith('@'):
        url = 'https://t.me/' + url.lstrip('@')
    import os, info as _info
    os.environ['MOVIE_GROUP'] = url
    _info.MOVIE_GROUP = url
    await message.reply(f"✅ **Movie group set!**\n`{url}`", parse_mode="markdown")


@Client.on_message(filters.command('set_daily_verify') & filters.user(ADMINS))
async def set_daily_verify(bot, message):
    parts = message.text.strip().split(None, 1)
    if len(parts) < 2:
        return await message.reply(
            "**Usage:** `/set_daily_verify <number>`\n\n"
            "How many times a user must click the shortlink per day before getting direct file access.\n\n"
            "**Example:** `/set_daily_verify 3` → users must verify 3×/day",
            parse_mode="markdown"
        )
    try:
        n = int(parts[1].strip())
        if n < 1:
            return await message.reply("❌ Minimum value is 1.")
        import os, info as _info
        os.environ['VERIFY_DAILY_LIMIT'] = str(n)
        _info.VERIFY_DAILY_LIMIT = n
        await message.reply(f"✅ **Daily verification limit set to** `{n}`\n\nUsers must verify {n}× per day before getting direct access.", parse_mode="markdown")
    except ValueError:
        await message.reply("❌ Must be a number, e.g. `/set_daily_verify 3`")


@Client.on_message(filters.command('list_premium') & filters.user(ADMINS))
async def list_premium(bot, message):
    from utils import temp
    if not temp.PREMIUM_USERS:
        return await message.reply("No premium users at the moment.")
    ids = '\n'.join(f'• `{uid}`' for uid in temp.PREMIUM_USERS)
    await message.reply(f"⭐️ **Premium Users:**\n\n{ids}", parse_mode="markdown")


@Client.on_message(filters.command('shortlink_status') & filters.user(ADMINS))
async def shortlink_status(bot, message):
    import info as _info
    lines = ["**🔗 Shortlink Status**\n"]
    if _info.SHORTLINK_URL and _info.SHORTLINK_API:
        lines.append(f"✅ Shortlink 1: `{_info.SHORTLINK_URL}`")
    else:
        lines.append("❌ Shortlink 1: Not set")
    if _info.SHORTLINK_URL2 and _info.SHORTLINK_API2:
        lines.append(f"✅ Shortlink 2: `{_info.SHORTLINK_URL2}`")
    else:
        lines.append("❌ Shortlink 2: Not set")
    if _info.SHORTLINK_URL3 and _info.SHORTLINK_API3:
        lines.append(f"✅ Shortlink 3: `{_info.SHORTLINK_URL3}`")
    else:
        lines.append("❌ Shortlink 3: Not set")
    lines.append(f"\n⏱ Verify Expire: **{_info.VERIFY_EXPIRE // 3600}h**")
    await message.reply('\n'.join(lines), parse_mode="markdown")
