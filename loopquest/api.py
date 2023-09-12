import os
import getpass
from .ui import choose_instance
from .utils import is_docker_installed


def init(local=None):
    if local is None:
        local = choose_instance() == "local"

    if local:
        # if is_docker_installed():
        #     print("Docker is detected. Running 'docker compose up'...")
        #     # In a real environment, you would uncomment the next line to run docker-compose up
        #     os.system("docker compose up -d")
        # else:
        #     raise Exception(
        #         "Docker is not installed. Visit the following URL to install Docker then try again: https://docs.docker.com/get-docker/"
        #     )

        os.environ["LOOPQUEST_FRONTEND"] = "http://localhost:5667"
        os.environ["LOOPQUEST_BACKEND"] = "http://localhost:5667/api"
        os.environ["LOOPQUEST_USER_ID"] = getpass.getuser()
    else:
        os.environ["LOOPQUEST_FRONTEND"] = "http://localhost:3000"
        os.environ["LOOPQUEST_BACKEND"] = "http://localhost:3000/api"
        os.environ["LOOPQUEST_USER_ID"] = ""


def is_initialized():
    return (
        "LOOPQUEST_FRONTEND" in os.environ
        and "LOOPQUEST_BACKEND" in os.environ
        and "LOOPQUEST_USER_ID" in os.environ
    )


def initailize(func):
    def inner(*args, **kwargs):
        if not is_initialized():
            init()
        return func(*args, **kwargs)

    return inner


@initailize
def get_frontend_url():
    return os.environ["LOOPQUEST_FRONTEND"]


@initailize
def get_backend_url():
    return os.environ["LOOPQUEST_BACKEND"]


@initailize
def get_user_id():
    return os.environ["LOOPQUEST_USER_ID"]


@initailize
def make_env(env, experiment_name=None, experiment_description=""):
    from .gym_wrappers import LoopquestGymWrapper
    from .utils import generate_experiment_name

    if experiment_name is None:
        experiment_name = generate_experiment_name()
    return LoopquestGymWrapper(env, experiment_name, experiment_description)
