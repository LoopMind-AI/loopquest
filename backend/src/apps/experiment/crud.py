from loopquest import schema
from .dependencies import get_experiment_collection
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from datetime import datetime


async def db_create_experiment(db, exp: schema.Experiment) -> schema.Experiment:
    collection = await get_experiment_collection(db)
    try:
        inserted_exp = await collection.insert_one(exp.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="experiment already exists")
    created_exp = await collection.find_one({"_id": inserted_exp.inserted_id})
    created_exp = schema.Experiment(**created_exp)
    return created_exp


async def db_get_experiment(db, id: str) -> schema.Experiment | None:
    collection = await get_experiment_collection(db)
    experiment = await collection.find_one({"id": id})
    if experiment is None:
        raise HTTPException(status_code=404, detail="experiment not found")
    experiment = schema.Experiment(**experiment)
    return experiment


async def db_update_experiment(db, id: str, new_exp: schema.ExperimentUpdate):
    exp = await db_get_experiment(db, id)
    new_exp_dict = new_exp.model_dump(exclude_unset=True)
    for field in new_exp_dict:
        setattr(exp, field, new_exp_dict[field])
    exp.update_time = datetime.now()

    collection = await get_experiment_collection(db)
    await collection.replace_one({"id": id}, exp.model_dump())
    return await db_get_experiment(db, id)


async def db_delete_experiment(db, id: str):
    exp = await db_get_experiment(db, id)
    collection = await get_experiment_collection(db)
    await collection.delete_one({"id": exp.id})


async def db_get_experiment_by_user_env(db, user_id: str, env_id: str):
    collection = await get_experiment_collection(db)
    exps = collection.find({"user_id": user_id, "environment_id": env_id})
    return [schema.Experiment(**exp) async for exp in exps]
