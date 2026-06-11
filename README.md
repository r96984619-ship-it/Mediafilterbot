# 🎬 Miviesfather — Telegram Movie Filter Bot

A fully-featured Telegram bot that indexes media files from channels, serves them via search/inline queries, shows IMDb info, enforces force-subscribe, supports shortlink monetization, premium users, and bulk movie announcements.

[![Deploy on Replit](https://replit.com/badge/github/r96984619-ship-it/Mediafilterbot)](https://replit.com/new/github/r96984619-ship-it/Mediafilterbot)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔍 Movie search | Type a movie name in any connected group — bot replies with file buttons |
| 🎭 IMDb lookup | Poster, plot, genre, cast, rating, runtime auto-fetched |
| 📡 Inline search | `@yourbot movie name` works anywhere |
| 🔒 Force Subscribe | Gate access behind up to **3 channels** |
| 💰 Shortlink verify | Daily verification via up to **3 shortlink providers** |
| 👑 Premium users | Bypass verification, direct file access |
| 📢 `/announce` | Broadcast movie poster + IMDb info + Search button to all users |
| 📊 `/stats` | Live DB + server stats dashboard |
| 📚 Multi-page `/help` | Admin / Filter / User sections with navigation |
| 🔄 Auto-reconnect | Exponential-backoff reconnect loop — never stays down |
| 🗄️ MongoDB | Persistent storage; falls back to in-memory if unavailable |
| 🚂 Railway-ready | Health check server on `$PORT`, `railway.json` included |

---

## 🚀 Quick Deploy

### Option A — Replit (Recommended, one click)

1. Click the **Deploy on Replit** button above
2. Replit opens the repo and launches the Agent
3. Tell the Agent:
   > "Set up this Telegram bot. I'll provide the secrets."
4. Add your secrets in the **Secrets** tab (see table below)
5. Hit **Run** — the bot is live

### Option B — Railway

1. Fork this repo on GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your fork
4. Add all environment variables (Settings → Variables)
5. Railway auto-detects `railway.json` and deploys

---

## 🔑 Environment Variables

Set these as **Secrets** in Replit (or Variables in Railway):

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `API_ID` | Telegram API ID from [my.telegram.org](https://my.telegram.org) | `12345678` |
| `API_HASH` | Telegram API Hash | `abcdef1234567890` |
| `BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather) | `123456:ABC-DEF` |

### Recommended

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URI` | MongoDB Atlas URI — without this, data resets on restart | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `ADMINS` | Space-separated Telegram user IDs with admin access | `123456789 987654321` |
| `CHANNELS` | Channel IDs to auto-index for media (space-separated) | `-1001234567890` |
| `LOG_CHANNEL` | Channel ID where the bot sends log messages | `-1001234567890` |

### Force Subscribe (up to 3 channels)

| Variable | Description |
|----------|-------------|
| `AUTH_CHANNEL` | First force-subscribe channel ID |
| `FSUB_2` | Second force-subscribe channel ID |
| `FSUB_3` | Third force-subscribe channel ID |

### Shortlink Monetization (up to 3 providers)

| Variable | Description |
|----------|-------------|
| `SHORTLINK_URL` | Shortlink domain (e.g. `api.shareus.io`) |
| `SHORTLINK_API` | API key for provider 1 |
| `SHORTLINK_URL2` / `SHORTLINK_API2` | Provider 2 |
| `SHORTLINK_URL3` / `SHORTLINK_API3` | Provider 3 |
| `VERIFY_DAILY_LIMIT` | Verifications needed per day (default: `1`) |
| `VERIFY_EXPIRE` | Seconds until verification expires (default: `86400`) |
| `VERIFY_TUTORIAL` | Tutorial URL shown to users |

### Premium / Group

| Variable | Description |
|----------|-------------|
| `SUB_LINK` | Link to buy premium subscription |
| `PREMIUM_PASS` | Secret passphrase for self-activating premium |
| `MOVIE_GROUP` | Your movie group link (e.g. `https://t.me/+xxxx`) |

### Optional Toggles

| Variable | Default | Description |
|----------|---------|-------------|
| `IMDB` | `True` | Show IMDb info on results |
| `SINGLE_BUTTON` | `False` | Show filename + size as one button |
| `PROTECT_CONTENT` | `False` | Prevent forwarding of sent files |
| `SPELL_CHECK_REPLY` | `True` | Suggest corrections when no results |
| `P_TTI_SHOW_OFF` | `False` | Redirect group users to PM |
| `LONG_IMDB_DESCRIPTION` | `False` | Full plot instead of short |
| `SUPPORT_CHAT` | `backupchannek` | Support username shown in /start |

---

## 🤖 Building on This With an AI Agent

This repo is structured to be **agent-friendly**. If you're using Replit Agent, Cursor, or any AI coding assistant, here are useful prompts to extend the bot:

### Setup from scratch
> "Read the README and set up this Telegram bot. Walk me through the required secrets."

### Add a new feature
> "Add a `/trending` command that shows the 10 most-searched movies this week, stored in MongoDB."

### Change the welcome message
> "Edit `bot/Script.py` and update `START_TXT_NO_SHORTLINK` to include my channel link @mychannel."

### Add a 4th shortlink provider
> "Add support for a 4th shortlink provider using `SHORTLINK_URL4` and `SHORTLINK_API4` in `info.py`, `utils.py`, and `plugins/commands.py`."

### Change force-subscribe logic
> "Make the bot check force-subscribe only for new users, not on every file request."

### Deploy to Railway
> "This bot is already Railway-compatible. Help me deploy it — what environment variables do I need to set?"

---

## 📁 Project Structure

```
bot/
├── bot.py              ← Entry point — auto-reconnect supervisor loop
├── info.py             ← All config loaded from environment variables
├── utils.py            ← Shared helpers: IMDb, shortlink, verify, caption clean
├── Script.py           ← All message templates (edit here to change bot text)
├── logging.conf        ← Logging configuration
├── requirements.txt    ← Python dependencies
├── start.sh            ← Startup script
├── database/
│   ├── ia_filterdb.py          ← Media index (files from channels)
│   ├── users_chats_db.py       ← Users & groups database
│   ├── connections_mdb.py      ← Group↔PM connections
│   └── filters_mdb.py          ← Manual keyword filters
└── plugins/
    ├── commands.py     ← /start /help /stats /settings /premium
    ├── pm_filter.py    ← Auto-filter, file buttons, callbacks
    ├── filters.py      ← /filter /filters /del /delall
    ├── broadcast.py    ← /broadcast /announce /grp_broadcast
    ├── misc.py         ← /id /info /imdb /search
    ├── inline.py       ← Inline query handler
    ├── index.py        ← Channel indexing
    ├── connection.py   ← /connect /disconnect /connections
    ├── genlink.py      ← /genlink /batch
    ├── banned.py       ← Banned user/chat filter
    ├── channel.py      ← Auto-index new media from channels
    └── p_ttishow.py    ← Group join/leave/ban/stats and welcome
```

---

## 🛠 MongoDB Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free cluster
2. **Database Access** → Add a user with password
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Connect** → Drivers → copy the connection string
5. Replace `<password>` in the URI and set it as `DATABASE_URI` secret

> Without `DATABASE_URI`, the bot uses an in-memory store — fully functional but data resets on restart.

---

## 📋 Admin Commands Reference

| Command | Description |
|---------|-------------|
| `/stats` | Database + server statistics |
| `/broadcast` | Send a message to all users (reply to any message) |
| `/announce <movie>` | Fetch IMDb poster + broadcast with Search button |
| `/grp_broadcast` | Send a message to all groups |
| `/fsu` `/fsu2` `/fsu3` | Set force-subscribe channels |
| `/del_fsub` `/del_fsub2` `/del_fsub3` | Remove force-subscribe channels |
| `/show_fsub` | Show current force-subscribe config |
| `/shortlink` | Set shortlink provider 1 |
| `/shortlink2` `/shortlink3` | Set providers 2 and 3 |
| `/shortlink_status` | Show current shortlink config |
| `/tutorial` `/tutorial2` `/tutorial3` | Set tutorial URLs |
| `/set_daily_verify <n>` | Set verifications needed per day |
| `/premium <user_id>` | Grant premium to a user |
| `/unpremium <user_id>` | Revoke premium |
| `/list_premium` | List all premium users |
| `/set_sub_link <url>` | Set premium purchase link |
| `/set_movie_group <url>` | Set movie group link |
| `/ban` `/unban` | Ban / unban users |
| `/users` `/chats` | Count users / groups in DB |
| `/logs` | Get the bot log file |
| `/leave <chat_id>` | Make the bot leave a group |

---

## ⚙️ How Auto-Reconnect Works

The bot uses a supervisor loop with **exponential backoff**:

```
Connection drop → wait 5s → reconnect
Fails again     → wait 10s → reconnect
Fails again     → wait 20s → ...
                             (caps at 2 minutes)
Reconnects OK   → reset back to 5s delay
```

The health check server (used by Railway) stays running the entire time, so the platform never marks the service as down during a reconnect cycle.

---

## 📄 License

MIT — fork freely, build your own bot, credit appreciated but not required.
