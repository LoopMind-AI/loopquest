from ..database import get_or_create_collection_with_index

PROJECT_COLLECTION = "projects"


async def get_project_collection(db):
    return await get_or_create_collection_with_index(db, PROJECT_COLLECTION, "id")
