import os
import getpass
import webbrowser
from .crud import get_cloud_user_id
from .private_api import (
    is_cloud_instance_initialized,
    verify_token,
    save_token_to_env,
    add_env_to_gitignore,
    CLOUD_BACKEND_URL,
    CLOUD_FRONTEND_URL,
)


def init():
    if is_initialized():
        print("LoopQuest is already initialized.")
        return
    sign_in_url = f"{CLOUD_FRONTEND_URL}/token"
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

    print(
        "Saving the token to .env file... Please keep your token safe. DO NOT share this token with others!"
    )
    save_token_to_env(token)
    print("In case .env file is tracked by git, Adding .env to .gitignore...")
    add_env_to_gitignore()
    print("LoopQuest is initialized.")


def is_initialized():
    return is_cloud_instance_initialized()


def get_frontend_url():
    return CLOUD_FRONTEND_URL


def get_backend_url():
    return CLOUD_BACKEND_URL


def get_user_id(backend_url=None):
    if backend_url is None:
        backend_url = get_backend_url()
    return get_cloud_user_id(backend_url)
