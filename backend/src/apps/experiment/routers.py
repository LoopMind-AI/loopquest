from fastapi import Request
from fastapi.routing import APIRouter
from loopquest import schema
from datetime import datetime
from .crud import *
from shortuuid import ShortUUID

ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"
gen_short_uuid = lambda: ShortUUID(alphabet=ALPHABET).random(length=8)

api_router = APIRouter(
    prefix="/exp",
    tags=["Experiment"],
)


@api_router.post("", response_model=schema.Experiment)
async def create_experiment(request: Request, experiment: schema.ExperimentCreate):
    while True:
        try:
            short_uuid = gen_short_uuid()
            env = schema.Experiment(
                **experiment.model_dump(),
                id=short_uuid,
                creation_time=datetime.now(),
                update_time=datetime.now()
            )
            return await db_create_experiment(request.app.db, env)
        except HTTPException as e:
            if e.status_code == 409:
                continue
            else:
                raise e


@api_router.get("/all", response_model=list[schema.Experiment])
async def get_all_experiments(request: Request):
    exps = await db_get_all_experiments(request.app.db)
    return exps


@api_router.get("/{id}", response_model=schema.Experiment)
async def read_experiment(request: Request, id: str):
    env = await db_get_experiment(request.app.db, id)
    return env


@api_router.put("/{id}", response_model=schema.Experiment)
async def update_experiment(
    request: Request, id: str, experiment: schema.ExperimentUpdate
):
    env = await db_update_experiment(request.app.db, id, experiment)
    return env


@api_router.delete("/{id}")
async def delete_experiment(request: Request, id: str):
    await db_delete_experiment(request.app.db, id)
    return {"message": "Experiment deleted successfully"}


@api_router.get("/user/{user_id}/env/{env_id}", response_model=list[schema.Experiment])
async def get_experiment_by_user_env(request: Request, user_id: str, env_id: str):
    exps = await db_get_experiment_by_user_env(request.app.db, user_id, env_id)
    return exps


@api_router.get("/user/{user_id}", response_model=list[schema.Experiment])
async def get_experiment_by_user(request: Request, user_id: str):
    exps = await db_get_experiment_by_user(request.app.db, user_id)
    return exps
