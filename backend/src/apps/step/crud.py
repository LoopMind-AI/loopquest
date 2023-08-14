from loopquest import schema
from fastapi import UploadFile
from .dependencies import get_step_collection
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from pymongo import ASCENDING
from datetime import datetime
from aiofiles import open as async_open
import os

MEDIA_DIR = "/media"


# TODO: #1 all the crud operations are so similar, can we make a generic crud.py?
async def db_create_step(db, step: schema.Step) -> schema.Step:
    collection = await get_step_collection(db)
    try:
        inserted_step = await collection.insert_one(step.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="step already exists")
    created_step = await collection.find_one({"_id": inserted_step.inserted_id})
    created_step = schema.Step(**created_step)
    return created_step


async def db_get_step(db, id: str) -> schema.Step:
    collection = await get_step_collection(db)
    step = await collection.find_one({"id": id})
    if step is None:
        raise HTTPException(status_code=404, detail="step not found")
    step = schema.Step(**step)
    return step


async def db_update_step(db, id: str, new_step: schema.StepUpdate):
    step = await db_get_step(db, id)
    new_step_dict = new_step.model_dump(exclude_unset=True)
    for field in new_step_dict:
        setattr(step, field, new_step_dict[field])
    step.update_time = datetime.now()

    collection = await get_step_collection(db)
    await collection.replace_one({"id": id}, step.model_dump())
    return await db_get_step(db, id)


async def db_delete_step(db, id: str):
    step = await db_get_step(db, id)
    collection = await get_step_collection(db)
    await collection.delete_one({"id": step.id})


async def save_step_image(id: str, image_id: int, image: UploadFile):
    filename = f"{id}-{image_id}.jpg"
    async with async_open(os.path.join(MEDIA_DIR, filename), "wb") as buffer:
        content = await image.read()
        await buffer.write(content)
    return


def get_step_image_path(id: str, image_id: int):
    filename = f"{id}-{image_id}.jpg"
    return os.path.join(MEDIA_DIR, filename)


async def db_get_max_step(db, exp_id: str, episode_id: int):
    collection = await get_step_collection(db)
    results = collection.aggregate(
        [
            {"$match": {"experiment_id": exp_id, "episode": episode_id}},
            {"$group": {"_id": None, "max_step": {"$max": "$step"}}},
        ]
    )
    results = [res async for res in results]
    return results[0]["max_step"] if len(results) > 0 else 0


async def db_get_max_episode(db, exp_id: str):
    collection = await get_step_collection(db)
    results = collection.aggregate(
        [
            {"$match": {"experiment_id": exp_id}},
            {"$group": {"_id": None, "max_episode": {"$max": "$episode"}}},
        ]
    )
    results = [res async for res in results]
    return results[0]["max_episode"] if len(results) > 0 else 0


async def db_get_reward_stats(db, exp_id: str):
    collection = await get_step_collection(db)
    results = collection.aggregate(
        [
            {"$match": {"experiment_id": exp_id}},
            {"$group": {"_id": "$episode", "sum_reward": {"$sum": "$reward"}}},
            {
                "$group": {
                    "_id": None,
                    "mean_reward": {"$avg": "$sum_reward"},
                    "std_reward": {"$stdDevSamp": "$sum_reward"},
                }
            },
        ]
    )
    results = [res async for res in results]
    return results[0]


async def db_get_observation(db, exp_id, obs_id):
    collection = await get_step_collection(db)
    results = collection.aggregate(
        [
            {"$match": {"experiment_id": exp_id}},
            {
                "$project": {
                    "_id": 0,
                    "episode": 1,
                    "step": 1,
                    "obs": {"$arrayElemAt": ["$observation", obs_id]},
                }
            },
            {"$sort": {"episode": 1, "step": 1}},
        ]
    )
    results = [res["obs"] async for res in results]
    return results


async def db_get_action(db, exp_id, act_id):
    collection = await get_step_collection(db)
    results = collection.aggregate(
        [
            {"$match": {"experiment_id": exp_id}},
            {
                "$project": {
                    "_id": 0,
                    "episode": 1,
                    "step": 1,
                    "act": {"$arrayElemAt": ["$action", act_id]},
                }
            },
            {"$sort": {"episode": 1, "step": 1}},
        ]
    )
    results = [res["act"] async for res in results]
    return results


async def db_get_reward(db, exp_id):
    collection = await get_step_collection(db)
    results = collection.find(
        filter={"experiment_id": exp_id},
        projection={"_id": 0, "reward": 1},
        sort=list({"episode": 1, "step": 1}.items()),
    )
    rewards = [res["reward"] async for res in results]
    return rewards
