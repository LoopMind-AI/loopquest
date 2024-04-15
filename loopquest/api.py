import os
import getpass
import webbrowser
from .ui import choose_instance
from .crud import (
    get_cloud_user_id,
    send_instance_choice_stats,
)
from .private_api import (
    is_local_instance_initialized,
    is_cloud_instance_initialized,
    start_local_instance,
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
        if is_local_instance_initialized():
            print(
                "Local LoopQuest instance is already initialized. Using the existing instance ..."
            )
        else:
            start_local_instance()
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
            print("Please run `loopquest.init()` first.")
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
        # NOTE: hard-coding the local user id, so the frontend can use this user
        # id to fetch the user data.
        return "local_user"
    return get_cloud_user_id(get_backend_url())


def close():
    if is_local_instance_initialized():
        os.system("docker compose down")
