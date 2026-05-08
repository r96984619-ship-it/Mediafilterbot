class script(object):

    # ── Start / Home ─────────────────────────────────────────────────────────

    START_TXT_VERIFIED = """👋 <b>HEY {name} {greeting},</b>

✅ <b>YOU ARE VERIFIED FOR TODAY!</b>

<b>#VERIFICATION:-</b> {count}/{limit} ✔️

You can now get files directly without any verification.
Enjoy unlimited access till midnight! 🎬"""

    START_TXT_UNVERIFIED = """👋 <b>HEY {name} {greeting},</b>

🚀 <b>YOU ARE NOT VERIFIED TODAY, PLEASE CLICK ON VERIFY & GET UNLIMITED ACCESS FOR TILL NEXT VERIFICATION</b>

<b>#VERIFICATION:-</b> {count}/{limit} ✔️

IF YOU WANT DIRECT FILES WITHOUT ANY VERIFICATIONS THEN BUY BOT SUBSCRIPTION."""

    START_TXT_NO_SHORTLINK = """👋 <b>HEY {name} {greeting},</b>

I am <a href="https://t.me/{uname}">{bname}</a> — a powerful movie search bot.

🔍 Just type a movie name in your group and I'll find it instantly.

📌 <b>What I can do:</b>
• Auto-search movies from indexed channels
• Show full IMDb info with poster
• Inline search anywhere
• Generate sharing links

Add me to your group and enjoy! 🎬"""

    # ── PM redirect ───────────────────────────────────────────────────────────

    PM_REDIRECT = """<b>HEY {name},</b>

I CANT GIVE MOVIE HERE
I WORK ONLY IN GROUPS 📢"""

    # ── Help ─────────────────────────────────────────────────────────────────

    HELP_TXT = """<b>📚 Help Menu — {}</b>

Choose a topic below to learn more 👇"""

    ABOUT_TXT = """<b>⚙️ About Me</b>

✦ <b>Name:</b> {}
✦ <b>Creator:</b> <a href="https://t.me/backupchannek">Miviesfather</a>
✦ <b>Library:</b> Pyrogram
✦ <b>Language:</b> Python 3
✦ <b>Database:</b> MongoDB
✦ <b>Server:</b> Replit
✦ <b>Version:</b> v2.0.0"""

    SOURCE_TXT = """<b>📦 Source Code</b>

This bot is based on the open-source EvaMaria project.
• Source: https://github.com/EvamariaTG/EvaMaria

<b>Developers:</b>
• <a href="https://t.me/backupchannek">Miviesfather</a>"""

    MANUELFILTER_TXT = """<b>📌 Manual Filters</b>

Set automated replies for specific keywords in your group.

<b>Notes:</b>
• Bot must be admin in the group
• Only group admins can add filters
• Alert buttons are limited to 64 characters

<b>Commands:</b>
• /filter — Add a new filter
• /filters — List all filters
• /del — Delete a filter
• /delall — Delete all filters (owner only)"""

    BUTTON_TXT = """<b>🔘 Button Syntax</b>

<b>URL Button:</b>
<code>[Button Text](buttonurl:https://t.me/backupchannek)</code>

<b>Alert Button:</b>
<code>[Button Text](buttonalert:Your alert message here)</code>"""

    AUTOFILTER_TXT = """<b>🔍 Auto Filter</b>

I automatically search indexed channels when users type movie names in a group.

<b>Setup:</b>
1. Make me admin of your private channel
2. Forward the last message to me (with quotes)
3. I'll index all files in that channel"""

    CONNECTION_TXT = """<b>🔗 Group Connections</b>

Connect groups to your PM for managing filters without spamming.

<b>Commands:</b>
• /connect — Connect a group to your PM
• /disconnect — Disconnect from a group
• /connections — List all your connections"""

    EXTRAMOD_TXT = """<b>🧩 Extra Modules</b>

<b>Commands:</b>
• /id — Get your Telegram ID
• /info — Get detailed info about a user
• /imdb — Search IMDb for a movie or show
• /search — Search IMDb by title"""

    ADMIN_TXT = """<b>🛠 Admin Commands</b>

<b>General:</b>
• /logs — Get recent error logs
• /stats — Show database statistics
• /delete — Delete a file from DB
• /users — List all bot users
• /chats — List all connected chats
• /leave — Leave a chat
• /disable — Disable a chat
• /ban — Ban a user
• /unban — Unban a user
• /channel — List connected channels
• /broadcast — Broadcast to all users
• /grp_broadcast — Broadcast to all groups

<b>Shortlink & Monetization:</b>
• /shortlink &lt;url&gt; &lt;api&gt; — Set shortlink 1
• /shortlink_status — Check shortlink status
• /set_daily_verify &lt;n&gt; — Set verifications per day
• /fsu &lt;channel&gt; — Force subscribe channel
• /del_fsub — Remove force subscribe
• /tutorial &lt;url&gt; — Set bypass tutorial video
• /set_caption — Set custom file caption
• /set_log — Set log channel

<b>Premium:</b>
• /premium &lt;user_id&gt; — Grant premium to user
• /unpremium &lt;user_id&gt; — Remove premium
• /set_sub_link &lt;url&gt; — Set subscription buy link
• /set_movie_group &lt;url&gt; — Set movie group link"""

    STATUS_TXT = """<b>📊 Bot Statistics</b>

📁 <b>Total Files:</b> <code>{}</code>
👥 <b>Total Users:</b> <code>{}</code>
💬 <b>Total Chats:</b> <code>{}</code>
💾 <b>Used Storage:</b> <code>{}</code> MiB
🆓 <b>Free Storage:</b> <code>{}</code> MiB"""

    LOG_TEXT_G = """<b>#NewGroup</b>
👥 Group: <b>{}</b> (<code>{}</code>)
👤 Members: <code>{}</code>
➕ Added By: {}
"""

    LOG_TEXT_P = """<b>#NewUser</b>
🆔 ID: <code>{}</code>
👤 Name: {}
"""
