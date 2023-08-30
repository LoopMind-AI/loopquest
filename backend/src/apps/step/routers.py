from fastapi import Request, UploadFile, File
from fastapi.routing import APIRouter
from fastapi.responses import FileResponse
from loopquest import schema
from datetime import datetime
from .crud import *


api_router = APIRouter(
    prefix="/step",
    tags=["Step"],
)


@api_router.post("", response_model=schema.Step)
async def create_step(request: Request, step: schema.StepCreate):
    env = schema.Step(
        id=f"{step.experiment_id}-{step.episode}-{step.step}",
        creation_time=datetime.now(),
        update_time=datetime.now(),
        **step.model_dump(),
    )
    created_env = await db_create_step(request.app.db, env)
    return created_env


@api_router.get("/{id}", response_model=schema.Step)
async def read_step(request: Request, id: str):
    env = await db_get_step(request.app.db, id)
    return env


@api_router.put("/{id}", response_model=schema.Step)
async def update_step(request: Request, id: str, step: schema.StepUpdate):
    env = await db_update_step(request.app.db, id, step)
    return env


@api_router.delete("/{id}")
async def delete_step(request: Request, id: str):
    await db_delete_step(request.app.db, id)
    return {"message": "step deleted successfully"}


@api_router.get("/{id}/image", response_model=list[str])
async def get_step_rendered_image_urls(request: Request, id: str):
    step = await db_get_step(request.app.db, id)
    return step.image_urls


@api_router.post("/{id}/image/{image_id}")
async def upload_step_rendered_image(
    request: Request,
    id: str,
    image_id: int = 0,
    image: UploadFile = File(...),
):
    # save the image
    await save_step_image(id, image_id, image)

    # update the step with the image url
    step = await db_get_step(request.app.db, id)
    # NOTE: the current request url is the same as the get image url. This is a
    # strong assumption, and should be changed in the future.
    image_urls = step.image_urls + [str(request.url)]
    step_update = await db_update_step(
        request.app.db, id, schema.StepUpdate(image_urls=image_urls)
    )
    return step_update


@api_router.get("/{id}/image/{image_id}")
async def get_step_rendered_image(
    id: str,
    image_id: int = 0,
):
    image_path = get_step_image_path(id, image_id)
    return FileResponse(image_path, media_type="image/jpeg")


@api_router.get("/exp/{exp_id}")
async def get_experiment(request: Request, exp_id: str):
    return await db_get_steps_by_experiment(request.app.db, exp_id)


@api_router.get("/exp/{exp_id}/eps/{episode_id}/step/max")
async def get_max_step(request: Request, exp_id: str, episode_id: int):
    return await db_get_max_step(request.app.db, exp_id, episode_id)


@api_router.get("/exp/{exp_id}/eps/max")
async def get_max_episode(request: Request, exp_id: str):
    return await db_get_max_episode(request.app.db, exp_id)


@api_router.get("/exp/{exp_id}/reward")
async def get_rewards(request: Request, exp_id: str):
    return await db_get_reward(request.app.db, exp_id)


@api_router.get("/exp/{exp_id}/reward/stats")
async def get_reward_stats(request: Request, exp_id: str):
    return await db_get_reward_stats(request.app.db, exp_id)


@api_router.get("/exp/{exp_id}/obs/{obs_id}")
async def get_observation(request: Request, exp_id: str, obs_id: int):
    return await db_get_observation(request.app.db, exp_id, obs_id)


@api_router.get("/exp/{exp_id}/act/{act_id}")
async def get_action(request: Request, exp_id: str, act_id: int):
    return await db_get_action(request.app.db, exp_id, act_id)


@api_router.get("/exp/{exp_id}/reward")
async def get_action(request: Request, exp_id: str):
    return await db_get_reward(request.app.db, exp_id)
