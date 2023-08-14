from loopquest import schema
from .dependencies import get_environment_collection
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from datetime import datetime


async def db_create_environment(db, env: schema.Environment) -> schema.Environment:
    collection = await get_environment_collection(db)
    try:
        inserted_env = await collection.insert_one(env.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Environment already exists")
    created_env = await collection.find_one({"_id": inserted_env.inserted_id})
    created_env = schema.Environment(**created_env)
    return created_env


async def db_get_environment(db, id: str) -> schema.Environment | None:
    collection = await get_environment_collection(db)
    environment = await collection.find_one({"id": id})
    if environment is None:
        raise HTTPException(status_code=404, detail="Environment not found")
    environment = schema.Environment(**environment)
    return environment


async def db_get_all_environments(db) -> list[schema.Environment]:
    collection = await get_environment_collection(db)
    items = collection.find()
    return [schema.Environment(**item) async for item in items]


async def db_update_environment(db, id: str, new_env: schema.EnvironmentUpdate):
    env = await db_get_environment(db, id)
    new_env_dict = new_env.model_dump(exclude_unset=True)
    for field in new_env_dict:
        setattr(env, field, new_env_dict[field])
    env.update_time = datetime.now()

    collection = await get_environment_collection(db)
    await collection.replace_one({"id": id}, env.model_dump())
    return await db_get_environment(db, env.id)


async def db_delete_environment(db, id: str):
    env = await db_get_environment(db, id)
    collection = await get_environment_collection(db)
    await collection.delete_one({"id": env.id})
