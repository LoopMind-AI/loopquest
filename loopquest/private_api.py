import requests
import os
from .utils import update_or_append_env_var


# For Dev
# CLOUD_FRONTEND_URL = "http://localhost:3000"
# CLOUD_BACKEND_URL = "http://localhost:3000/api"

CLOUD_FRONTEND_URL = "https://www.loopquest.ai"
CLOUD_BACKEND_URL = "https://www.loopquest.ai/api"
TOKEN_ENV_VAR_NAME = "LOOPQUEST_USER_TOKEN"


def is_cloud_instance_initialized():
    from .crud import get_cloud_user_id

    try:
        get_cloud_user_id(CLOUD_BACKEND_URL)
        return True
    except Exception as e:
        return False


def verify_token(token):
    try:
        response = requests.get(
            f"{CLOUD_BACKEND_URL}/user_id", headers={"Authorization": f"{token}"}
        )
        response.raise_for_status()
        return True
    except:
        return False


def save_token_to_env(token):
    update_or_append_env_var(
        TOKEN_ENV_VAR_NAME,
        token,
        comment="WARNING: This token is very sensitive. Do not publish it anywhere!",
    )
    os.environ[TOKEN_ENV_VAR_NAME] = token


def add_env_to_gitignore():
    gitignore_path = os.path.join(os.getcwd(), ".gitignore")
    if os.path.exists(gitignore_path):
        if is_dotenv_in_gitignore(gitignore_path):
            return
        with open(gitignore_path, "a") as f:
            f.write("\n# Added by LoopQuest\n")
            f.write(".env\n")
    else:
        with open(gitignore_path, "w") as f:
            f.write("# Added by LoopQuest\n")
            f.write(".env\n")


def is_dotenv_in_gitignore(gitignore_path):
    try:
        with open(gitignore_path, "r") as file:
            for line in file:
                # Strip whitespace and check if line starts with '#'
                stripped_line = line.strip()
                if not stripped_line.startswith("#") and stripped_line == ".env":
                    return True
        return False
    except FileNotFoundError:
        # Handle the case where .gitignore might not exist
        return False
