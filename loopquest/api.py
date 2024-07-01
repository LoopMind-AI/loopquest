import os
import getpass
import webbrowser
from .crud import get_cloud_user_id
from .private_api import (
    is_cloud_instance_initialized,
    verify_token,
    save_token_to_env,
    CLOUD_BACKEND_URL,
    CLOUD_FRONTEND_URL,
    DEV_FRONTEND_URL,
    DEV_BACKEND_URL,
)


def init(dev=False):
    if dev:
        os.environ["IS_DEV_ENV"] = "true"
    else:
        os.environ["IS_DEV_ENV"] = "false"
    if is_initialized():
        print("LoopQuest is already initialized.")
        return
    sign_in_url = f"{get_frontend_url()}/token"
    print(
        f"Opening LoopQuest Sign-In page ... \nIf the browser does not open automatically, visit {sign_in_url} manually."
    )
    webbrowser.open_new(sign_in_url)
    while True:
        token = getpass.getpass("Enter your LoopQuest user token: ").strip()
        if verify_token(token):
            print("Token is verified.")
            break
        else:
            print("Token is invalid. Please try again.")

    save_token_to_env(token)
    print("LoopQuest is initialized.")


def is_initialized():
    return is_cloud_instance_initialized()


def get_frontend_url():
    if os.getenv("IS_DEV_ENV") == "true":
        print("Using Dev Frontend URL")
        return DEV_FRONTEND_URL
    return CLOUD_FRONTEND_URL


def get_backend_url():
    if os.environ["IS_DEV_ENV"] == "true":
        return DEV_BACKEND_URL
    return CLOUD_BACKEND_URL


def get_user_id(backend_url=None):
    if backend_url is None:
        backend_url = get_backend_url()
    return get_cloud_user_id(backend_url)
