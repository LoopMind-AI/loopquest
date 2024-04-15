from loopquest import schema
from .dependencies import get_project_collection
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from datetime import datetime


async def db_create_project(db, project: schema.Project) -> schema.Project:
    collection = await get_project_collection(db)
    try:
        inserted_project = await collection.insert_one(project.model_dump())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="project already exists")
    created_project = await collection.find_one({"_id": inserted_project.inserted_id})
    created_project = schema.Project(**created_project)
    return created_project


async def db_get_project(db, id: str) -> schema.Project | None:
    collection = await get_project_collection(db)
    project = await collection.find_one({"id": id})
    if project is None:
        raise HTTPException(status_code=404, detail="project not found")
    project = schema.Project(**project)
    return project


async def db_get_project_by_name_and_user_id(
    db, name: str, user_id: str
) -> schema.Project | None:
    collection = await get_project_collection(db)
    project = await collection.find_one({"name": name, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="project not found")
    project = schema.Project(**project)
    return project


async def db_update_project(db, id: str, new_project: schema.ProjectUpdate):
    project = await db_get_project(db, id)
    new_project_dict = new_project.model_dump(exclude_unset=True)
    for field in new_project_dict:
        setattr(project, field, new_project_dict[field])
    project.update_time = datetime.now()

    collection = await get_project_collection(db)
    await collection.replace_one({"id": id}, project.model_dump())
    return await db_get_project(db, id)


async def db_delete_project(db, id: str):
    project = await db_get_project(db, id)
    collection = await get_project_collection(db)
    await collection.delete_one({"id": project.id})


async def db_get_project_by_user(db, user_id: str):
    collection = await get_project_collection(db)
    projects = collection.find({"user_id": user_id}, sort=[("update_time", -1)])
    return [schema.Project(**project) async for project in projects]
