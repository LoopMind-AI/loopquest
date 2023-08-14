from ..database import get_or_create_collection_with_index

EXPERIMENT_COLLECTION = "experiments"


# TODO: #3 add environment_id index, since it is a frequent query.
async def get_experiment_collection(db):
    return await get_or_create_collection_with_index(db, EXPERIMENT_COLLECTION, "id")
