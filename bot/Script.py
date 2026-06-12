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

    # ── Force Subscribe ───────────────────────────────────────────────────────

    FSUB_TXT = """🔒 <b>Access Restricted!</b>

You must join {count} channel(s) to use this bot.
Please join all channels below and then tap <b>✅ I've Joined</b>.

{channel_list}"""

    # ── PM redirect ───────────────────────────────────────────────────────────

    PM_REDIRECT = """<b>HEY {name},</b>

I CANT GIVE MOVIE HERE
I WORK ONLY IN GROUPS 📢"""

    # ── Help ─────────────────────────────────────────────────────────────────

    HELP_TXT = """<b>📚 Help Menu — {}</b>

Choose a topic below to learn more 👇"""

    # ── Help pages (admin) ────────────────────────────────────────────────────

    HELP_ADMIN_TXT = """<b>📝 NOTE:</b>
<i>These Modules Only Work For My Admins</i>

<b>📋 Basic Command</b>
• /logs — Get The Recent Error Logs
• /stats — Live Database &amp; Server Stats

<b>📁 Database &amp; Server Command</b>
• /stats — Get Database Status
• /delete — Delete A Specific File From DB
• /deleteall — Delete All Files From DB
• /users — List Of All Users &amp; IDs
• /chats — List Of All Chats &amp; IDs
• /channel — List Of All Connected Channels
• /leave — Make Bot Leave A Chat
• /disable — Disable A Chat

<b>🔗 Indexing</b>
• /setskip — Set Skip Count For Indexing
• /set_log — Set Log Channel
• /set_caption — Set Custom File Caption
• /set_template — Set Custom IMDB Template"""

    HELP_FILTER_TXT = """<b>🔍 Global Filter &amp; Auto-Filter</b>

<b>Manual Filters:</b>
• /filter — Add A New Filter
• /filters — List All Active Filters
• /del — Delete A Specific Filter
• /delall — Delete All Filters (Owner Only)

<b>Auto Filter (File Search):</b>
• Forward last message of a private channel to me to index all its files
• Users type movie names in group → bot replies with file buttons
• /setskip &lt;n&gt; — Skip first N messages when indexing

<b>Group Connection:</b>
• /connect — Connect A Group To Your PM
• /disconnect — Disconnect From A Group
• /connections — List All Your Connections

<b>Settings:</b>
• /settings — Open Group Settings Menu"""

    HELP_USER_CHAT_TXT = """<b>👥 User &amp; Chat Management</b>

<b>Users:</b>
• /users — Get Full Users List &amp; IDs
• /ban &lt;user_id&gt; — Ban A User
• /unban &lt;user_id&gt; — Unban A User
• /id — Get Your Telegram ID
• /info — Get Detailed Info About A User

<b>Chats:</b>
• /chats — Get All Chats List &amp; IDs
• /leave &lt;chat_id&gt; — Make Bot Leave A Chat
• /disable &lt;chat_id&gt; — Disable Bot In A Chat
• /ginfo — Get Info About A Group

<b>Broadcast:</b>
• /broadcast — Send Message To All Users
• /grp_broadcast — Send Message To All Groups

<b>Force Subscribe:</b>
• /fsu &lt;channel&gt; — Set FSub Channel 1
• /fsu2 &lt;channel&gt; — Set FSub Channel 2
• /fsu3 &lt;channel&gt; — Set FSub Channel 3
• /del_fsub · /del_fsub2 · /del_fsub3 — Remove
• /show_fsub — Show All Active FSub Channels

<b>Premium &amp; Shortlink:</b>
• /premium &lt;user_id&gt; — Give User Premium Access
• /unpremium &lt;user_id&gt; — Remove Premium
• /list_premium — List All Premium Users
• /shortlink &lt;url&gt; &lt;api&gt; — Set Shortlink 1
• /shortlink2 / /shortlink3 — Set Shortlinks 2 &amp; 3
• /shortlink_status — Check Shortlink Config
• /tutorial &lt;url&gt; — Set Verification Tutorial
• /set_daily_verify &lt;n&gt; — Set Daily Verify Limit
• /set_sub_link &lt;url&gt; — Set Subscription Buy Link
• /set_movie_group &lt;url&gt; — Set Movie Group Link

<b>Gen Link:</b>
• /genlink — Generate Shareable File Link
• /batch — Generate Batch File Links"""

    HELP_USER_TXT = """<b>📚 How To Use Me</b>

<b>🎬 Search Movies:</b>
• Type the movie name in the group — I'll find it!
• Use inline: @{uname} movie name

<b>🔗 Links &amp; Connections:</b>
• /connect — Connect your group to PM
• /disconnect — Disconnect from group
• /connections — List your connections

<b>🪪 Info Commands:</b>
• /id — Get your Telegram ID
• /info @username — Get user info
• /imdb &lt;title&gt; — Search IMDb
• /search &lt;title&gt; — Search movie title"""

    ABOUT_TXT = """<b>⚙️ About Me</b>

✦ <b>Name:</b> {bname}
✦ <b>Username:</b> @{uname}
✦ <b>Creator:</b> <a href="https://t.me/BackupChannel5211">Miviesfather</a>
✦ <b>Library:</b> Pyrogram v2
✦ <b>Language:</b> Python 3.11
✦ <b>Database:</b> MongoDB
✦ <b>Version:</b> v2.0.0"""

    SOURCE_TXT = """<b>📦 Source Code</b>

This bot is based on the open-source EvaMaria project.
• Source: https://github.com/EvamariaTG/EvaMaria

<b>Developers:</b>
• <a href="https://t.me/BackupChannel5211">Miviesfather</a>"""

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
<code>[Button Text](buttonurl:https://t.me/BackupChannel5211)</code>

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
