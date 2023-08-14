from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()


def get_db_client() -> AsyncIOMotorClient:
    client = AsyncIOMotorClient(os.getenv("DB_URL"), uuidRepresentation="pythonLegacy")
    return client


def get_db():
    client = get_db_client()
    db = client[os.getenv("DB_NAME")]
    return db


async def get_or_create_collection_with_index(db, collection_name: str, index: str):
    if collection_name not in await db.list_collection_names():
        await db.create_collection(collection_name)
        await db[collection_name].create_index(index, unique=True)

    collection = db[collection_name]
    return collection
