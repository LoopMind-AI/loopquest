from fastapi import Request
from fastapi.routing import APIRouter
from loopquest import schema
from datetime import datetime
from .crud import *

api_router = APIRouter(
    tags=["Environment"],
)


@api_router.post("/env", response_model=schema.Environment)
async def create_environment(request: Request, environment: schema.EnvironmentCreate):
    env = schema.Environment(
        **environment.model_dump(),
        creation_time=datetime.now(),
        update_time=datetime.now()
    )
    created_env = await db_create_environment(request.app.db, env)
    return created_env


@api_router.get("/env/{id}", response_model=schema.Environment)
async def read_environment(request: Request, id: str):
    env = await db_get_environment(request.app.db, id)
    return env


@api_router.put("/env/{id}", response_model=schema.Environment)
async def update_environment(
    request: Request, id: str, environment: schema.EnvironmentUpdate
):
    env = await db_update_environment(request.app.db, id, environment)
    return env


@api_router.delete("/env/{id}")
async def delete_environment(request: Request, id: str):
    await db_delete_environment(request.app.db, id)
    return {"message": "Environment deleted successfully"}


@api_router.get("/envs/all", response_model=list[schema.Environment])
async def read_all_environment(request: Request):
    envs = await db_get_all_environments(request.app.db)
    return envs
