from ..database import get_or_create_collection_with_index

ENVIRONMENT_COLLECTION = "environments"


async def get_environment_collection(db):
    return await get_or_create_collection_with_index(db, ENVIRONMENT_COLLECTION, "id")
