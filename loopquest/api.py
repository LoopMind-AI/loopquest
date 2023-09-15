import os
import getpass
import webbrowser
from .ui import choose_instance
from .crud import get_cloud_user_id, send_instance_choice_stats
from .utils import is_docker_installed
from .private_api import (
    is_local_instance_initialized,
    is_cloud_instance_initialized,
    wait_for_local_instance_init,
    verify_token,
    save_token_to_env,
    add_env_to_gitignore,
    LOCAL_BACKEND_URL,
    LOCAL_FRONTEND_URL,
    CLOUD_BACKEND_URL,
    CLOUD_FRONTEND_URL,
)


def init(local: bool | None = None):
    if local is None:
        local = choose_instance() == "local"

    send_instance_choice_stats(CLOUD_BACKEND_URL, local)

    # TODO: add an api to record the choice of the instance.
    if local:
        if is_docker_installed():
            print("Docker is detected. Running 'docker compose up'...")
            # In a real environment, you would uncomment the next line to run docker-compose up
            os.system("docker compose up -d")
        else:
            raise Exception(
                "Docker is not installed. Visit the following URL to install Docker then try again: https://docs.docker.com/get-docker/"
            )
        wait_for_local_instance_init()

    else:
        sign_in_url = f"{CLOUD_FRONTEND_URL}/sign-in"
        print(
            f"Opening LoopQuest Sign-In page ... \nIf the browser does not open automatically, visit {sign_in_url} manually."
        )
        webbrowser.open_new(sign_in_url)
        while True:
            token = getpass.getpass(
                "Enter your LoopQuest user token (the token expires in 1 hour): "
            ).strip()
            if verify_token(token):
                print("Token is verified.")
                break
            else:
                print("Token is invalid. Please try again.")

        print(
            "Saving the token to .env file... Please keep your token safe. DO NOT share this token with others!"
        )
        save_token_to_env(token)
        print("In case .env file is tracked by git, Adding .env to .gitignore...")
        add_env_to_gitignore()

    print("LoopQuest is initialized.")


def is_initialized():
    return is_local_instance_initialized() or is_cloud_instance_initialized()


def initailize(func):
    def inner(*args, **kwargs):
        if not is_initialized():
            init()
        return func(*args, **kwargs)

    return inner


@initailize
def get_frontend_url():
    if is_local_instance_initialized():
        return LOCAL_FRONTEND_URL
    return CLOUD_FRONTEND_URL


@initailize
def get_backend_url():
    if is_local_instance_initialized():
        return LOCAL_BACKEND_URL
    return CLOUD_BACKEND_URL


@initailize
def get_user_id():
    if is_local_instance_initialized():
        return getpass.getuser()
    return get_cloud_user_id(get_backend_url())


@initailize
def make_env(env, experiment_name=None, experiment_description=""):
    from .gym_wrappers import LoopquestGymWrapper
    from .utils import generate_experiment_name

    if experiment_name is None:
        experiment_name = generate_experiment_name()
    return LoopquestGymWrapper(env, experiment_name, experiment_description)


def close():
    if is_local_instance_initialized():
        os.system("docker compose down")
