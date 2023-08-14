from fastapi import FastAPI
import uvicorn
from apps.database import get_db_client, get_db
from apps.environment.routers import api_router as environment_router
from apps.experiment.routers import api_router as experiment_router
from apps.step.routers import api_router as step_router


app = FastAPI()
app.include_router(environment_router)
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


if __name__ == "__main__":
    # This is for development only. Run `python main.py` to start the server.
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
