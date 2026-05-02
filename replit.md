# EvaMaria Telegram Bot

A full Python replication of the [EvaMaria](https://github.com/PIROXTG/EvaMaria) Telegram bot — a media-search/filter bot that indexes files from Telegram channels into MongoDB, serves them via inline queries and manual filters, includes IMDb lookup, admin tools, group connections, link generation, and broadcast.

## Directory Layout

```
bot/                  ← All Python source
├── bot.py            ← Entry point (Pyrogram Client subclass)
├── info.py           ← Config — reads environment variables
├── utils.py          ← Shared helpers, IMDb wrapper, temp state
├── Script.py         ← All bot message strings
├── logging.conf      ← Logging config
├── requirements.txt  ← Python dependencies
├── start.sh          ← Startup script (loads .env, installs deps, runs bot)
├── database/
│   ├── ia_filterdb.py          ← Media index (MongoDB OR in-memory mock)
│   ├── users_chats_db.py       ← Users & chats DB (MongoDB OR in-memory)
│   ├── connections_mdb.py      ← Group connections (MongoDB OR in-memory)
│   └── filters_mdb.py          ← Manual filters (MongoDB OR in-memory)
└── plugins/
    ├── commands.py     ← /start, /channel, /logs, /delete, /settings
    ├── pm_filter.py    ← Auto-filter, pagination, callback handler
    ├── filters.py      ← /filter /filters /del /delall
    ├── misc.py         ← /id /info /imdb /search
    ├── inline.py       ← Inline query handler
    ├── index.py        ← Channel indexing (/setskip, forwarded-link)
    ├── connection.py   ← /connect /disconnect /connections
    ├── genlink.py      ← /genlink /batch
    ├── broadcast.py    ← /broadcast /grp_broadcast
    ├── banned.py       ← Banned user/chat filter
    ├── channel.py      ← Auto-index new media from channels
    └── p_ttishow.py    ← Group join/leave/ban/stats and welcome
```

## Required Environment Variables

| Variable     | Description                                   |
|-------------|-----------------------------------------------|
| `API_ID`    | Telegram API ID (from https://my.telegram.org) |
| `API_HASH`  | Telegram API Hash                              |
| `BOT_TOKEN` | Bot token from @BotFather                      |

## Optional Environment Variables

| Variable           | Default        | Description                                 |
|-------------------|----------------|---------------------------------------------|
| `DATABASE_URI`    | *(none)*       | MongoDB URI — uses in-memory mock if unset  |
| `DATABASE_NAME`   | `Rajappan`     | MongoDB database name                       |
| `ADMINS`          | *(none)*       | Space-separated admin user IDs              |
| `CHANNELS`        | `0`            | Channel IDs to auto-index (space-separated) |
| `LOG_CHANNEL`     | `0`            | Log channel ID (0 = disabled)               |
| `AUTH_CHANNEL`    | *(none)*       | Force-subscribe channel ID                  |
| `SUPPORT_CHAT`    | `TeamEvamaria` | Support username                            |
| `P_TTI_SHOW_OFF`  | `False`        | Redirect group users to PM                  |
| `IMDB`            | `True`         | Show IMDb info in results                   |
| `SINGLE_BUTTON`   | `False`        | Single vs double file button                |
| `PROTECT_CONTENT` | `False`        | Protect files from forwarding               |
| `SPELL_CHECK_REPLY` | `True`       | Suggest corrections when no results         |

See `.env.example` for the full list.

## Running

1. Set required secrets (`API_ID`, `API_HASH`, `BOT_TOKEN`) in Replit Secrets.
2. Optionally set `DATABASE_URI` for persistent storage.
3. Start the **Telegram Bot** workflow.

## Key Design Decisions

- **In-memory mock DB**: All four database modules auto-detect the absence of `DATABASE_URI` and switch to thread-safe in-memory Python dicts. Data is lost on restart, but the bot fully operates without MongoDB for development/testing.
- **IMDb mock stub**: `utils.get_poster()` gracefully returns a stub result if `cinemagoer` fails to import or the lookup fails, so the bot never crashes on IMDb errors.
- **Pyrogram 2.x**: Uses `pyrogram==2.0.106` + `tgcrypto` for fast encryption. Inline queries, callback queries, message handlers, and channel auto-indexing all use the plugin system.

## Stack

- Python 3.11
- Pyrogram 2.0.106 + tgcrypto
- Motor 3.3.2 + umongo 3.1.0 (async MongoDB ODM)
- pymongo 4.6.1 (sync MongoDB for connections/filters)
- cinemagoer (IMDbPY successor)
- beautifulsoup4 + requests (spell-check Google scraping)
