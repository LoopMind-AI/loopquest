import os
import getpass


def init():
    os.environ["LOOPQUEST_FRONTEND"] = "http://localhost:5667"
    os.environ["LOOPQUEST_BACKEND"] = "http://localhost:8000"
    os.environ["LOOPQUEST_USER_ID"] = getpass.getuser()


def is_initialized():
    return (
        "LOOPQUEST_FRONTEND" in os.environ
        and "LOOPQUEST_BACKEND" in os.environ
        and "LOOPQUEST_USER_ID" in os.environ
    )


def get_frontend_url():
    if not is_initialized():
        init()
    return os.environ["LOOPQUEST_FRONTEND"]


def get_backend_url():
    if not is_initialized():
        init()
    return os.environ["LOOPQUEST_BACKEND"]


def get_user_id():
    if not is_initialized():
        init()
    return os.environ["LOOPQUEST_USER_ID"]
