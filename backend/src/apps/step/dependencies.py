from ..database import get_or_create_collection_with_index

STEP_COLLECTION = "steps"


# TODO: #2 create index for experiment_id since the query on experiment is a frequent usecase.
async def get_step_collection(db):
    return await get_or_create_collection_with_index(db, STEP_COLLECTION, "id")
