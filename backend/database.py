from pymongo import MongoClient

from backend.config import get_settings

settings = get_settings()

client = MongoClient(
    settings.mongo_uri,
    serverSelectionTimeoutMS=5000,
    appname="eventify-analytics-api",
)

db = client[settings.database_name]
