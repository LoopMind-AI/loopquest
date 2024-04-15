from fastapi import FastAPI
import uvicorn
from apps.database import get_db_client, get_db
from apps.environment.routers import api_router as environment_router
from apps.project.routers import api_router as project_router
from apps.experiment.routers import api_router as experiment_router
from apps.step.routers import api_router as step_router
import loopquest
from loopquest.eval import evaluate_remote_policy


app = FastAPI()
app.include_router(environment_router)
app.include_router(project_router)
app.include_router(experiment_router)
app.include_router(step_router)


@app.on_event("startup")
async def start_db_client():
    app.db_client = get_db_client()
    app.db = get_db()


@app.on_event("shutdown")
async def shutdown_db_client():
    app.db_client.close()


@app.get("/")
def welcome():
    return "Welcome to the LoopQuest API!"


@app.post("/eval")
def eval(eval_request: loopquest.schema.EvalRequest):
    evaluate_remote_policy(
        eval_request.huggingface_repo_id,
        eval_request.huggingface_filename,
        eval_request.algorithm_name,
        env_ids=eval_request.env_ids,
        num_episodes=eval_request.num_episodes,
        num_steps_per_episode=eval_request.num_steps_per_episode,
        project_name=eval_request.project_name,
        project_description=eval_request.project_description,
        experiment_name=eval_request.experiment_name,
        experiment_description=eval_request.experiment_description,
        experiment_configs=eval_request.experiment_configs,
        use_thread_pool=eval_request.use_thread_pool,
        max_workers=eval_request.max_workers,
    )
    return "Success!"


if __name__ == "__main__":
    # This is for development only. Run `python main.py` to start the server.
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
