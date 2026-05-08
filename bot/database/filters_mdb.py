import logging
from pyrogram import enums
from info import DATABASE_URI, DATABASE_NAME

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

USE_MONGO = bool(DATABASE_URI)

if USE_MONGO:
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        _client = AsyncIOMotorClient(DATABASE_URI, tlsAllowInvalidCertificates=True)
        mydb = _client[DATABASE_NAME]
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Using in-memory filters.")
        USE_MONGO = False

if not USE_MONGO:
    _FILTERS = {}

    async def add_filter(grp_id, text, reply_text, btn, file, alert):
        key = str(grp_id)
        if key not in _FILTERS:
            _FILTERS[key] = {}
        _FILTERS[key][str(text)] = {
            "text": str(text),
            "reply": str(reply_text),
            "btn": str(btn),
            "file": str(file),
            "alert": str(alert),
        }

    async def find_filter(group_id, name):
        group = _FILTERS.get(str(group_id), {})
        record = group.get(str(name))
        if record:
            return record["reply"], record["btn"], record.get("alert"), record["file"]
        return None, None, None, None

    async def get_filters(group_id):
        group = _FILTERS.get(str(group_id), {})
        return list(group.keys())

    async def delete_filter(message, text, group_id):
        group = _FILTERS.get(str(group_id), {})
        if str(text) in group:
            del group[str(text)]
            await message.reply_text(
                f"'{text}' deleted. I'll not respond to that filter anymore.",
                quote=True,
                parse_mode=enums.ParseMode.MARKDOWN
            )
        else:
            await message.reply_text("Couldn't find that filter!", quote=True)

    async def del_all(message, group_id, title):
        key = str(group_id)
        if key in _FILTERS:
            _FILTERS[key] = {}
            await message.edit_text(f"All filters from {title} has been removed")
        else:
            await message.edit_text(f"Nothing to remove in {title}!")

    async def count_filters(group_id):
        count = len(_FILTERS.get(str(group_id), {}))
        return False if count == 0 else count

    async def filter_stats():
        total = sum(len(v) for v in _FILTERS.values())
        return len(_FILTERS), total

else:
    async def add_filter(grp_id, text, reply_text, btn, file, alert):
        mycol = mydb[str(grp_id)]
        data = {
            "text": str(text),
            "reply": str(reply_text),
            "btn": str(btn),
            "file": str(file),
            "alert": str(alert),
        }
        try:
            await mycol.update_one({"text": str(text)}, {"$set": data}, upsert=True)
        except Exception:
            logger.exception("Some error occurred!", exc_info=True)

    async def find_filter(group_id, name):
        mycol = mydb[str(group_id)]
        try:
            file = await mycol.find_one({"text": name})
            if file:
                return file["reply"], file["btn"], file.get("alert"), file["file"]
        except Exception:
            pass
        return None, None, None, None

    async def get_filters(group_id):
        mycol = mydb[str(group_id)]
        texts = []
        try:
            async for doc in mycol.find():
                texts.append(doc["text"])
        except Exception:
            pass
        return texts

    async def delete_filter(message, text, group_id):
        mycol = mydb[str(group_id)]
        myquery = {"text": text}
        count = await mycol.count_documents(myquery)
        if count == 1:
            await mycol.delete_one(myquery)
            await message.reply_text(
                f"'{text}' deleted. I'll not respond to that filter anymore.",
                quote=True,
                parse_mode=enums.ParseMode.MARKDOWN
            )
        else:
            await message.reply_text("Couldn't find that filter!", quote=True)

    async def del_all(message, group_id, title):
        collections = await mydb.list_collection_names()
        if str(group_id) not in collections:
            await message.edit_text(f"Nothing to remove in {title}!")
            return
        mycol = mydb[str(group_id)]
        try:
            await mycol.drop()
            await message.edit_text(f"All filters from {title} has been removed")
        except Exception:
            await message.edit_text("Couldn't remove all filters from group!")

    async def count_filters(group_id):
        mycol = mydb[str(group_id)]
        count = await mycol.count_documents({})
        return False if count == 0 else count

    async def filter_stats():
        collections = await mydb.list_collection_names()
        if "CONNECTION" in collections:
            collections.remove("CONNECTION")
        totalcount = 0
        for collection in collections:
            mycol = mydb[collection]
            count = await mycol.count_documents({})
            totalcount += count
        return len(collections), totalcount
