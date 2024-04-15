from fastapi import Request
from fastapi.routing import APIRouter
from loopquest import schema
from datetime import datetime
from .crud import *
from ..utils import gen_short_uuid

api_router = APIRouter(
    prefix="/project",
    tags=["Project"],
)


@api_router.post("", response_model=schema.Project)
async def create_project(request: Request, project: schema.ProjectCreate):
    while True:
        try:
            short_uuid = gen_short_uuid()
            project = schema.Project(
                **project.model_dump(),
                id=short_uuid,
                creation_time=datetime.now(),
                update_time=datetime.now()
            )
            return await db_create_project(request.app.db, project)
        except HTTPException as e:
            if e.status_code == 409:
                continue
            else:
                raise e


@api_router.get("/{id}", response_model=schema.Project)
async def read_project(request: Request, id: str):
    project = await db_get_project(request.app.db, id)
    return project


@api_router.get("/name/{name}/user/{user_id}", response_model=schema.Project)
async def get_project_by_name_and_user_id(request: Request, name: str, user_id: str):
    project = await db_get_project_by_name_and_user_id(request.app.db, name, user_id)
    return project


@api_router.put("/{id}", response_model=schema.Project)
async def update_project(request: Request, id: str, project: schema.ProjectUpdate):
    project = await db_update_project(request.app.db, id, project)
    return project


@api_router.put("/{id}/add/exp/{exp_id}")
async def add_experiment_to_project(request: Request, id: str, exp_id: str):
    project = await db_get_project(request.app.db, id)
    if exp_id in project.experiment_ids:
        raise HTTPException(
            status_code=409, detail="Experiment already added to the project"
        )
    project.experiment_ids.append(exp_id)
    project.update_time = datetime.now()
    return await db_update_project(request.app.db, id, project)


@api_router.delete("/{id}")
async def delete_project(request: Request, id: str):
    await db_delete_project(request.app.db, id)
    return {"message": "Project deleted successfully"}


@api_router.get("/user/{user_id}", response_model=list[schema.Project])
async def get_project_by_user(request: Request, user_id: str):
    projects = await db_get_project_by_user(request.app.db, user_id)
    return projects
