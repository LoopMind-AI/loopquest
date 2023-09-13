import numpy as np
import json
import base64
import pickle
from gymnasium.spaces.utils import flatten
import io
from PIL import Image
import re
import random
import subprocess
import os


def cast_to_list(
    x,
) -> list[float | int | str]:
    if isinstance(x, np.ndarray):
        return x.tolist()
    elif isinstance(x, np.generic):
        return [x.item()]
    elif isinstance(x, (float, int, str)):
        return [x]
    else:
        # TODO: handle other types, and better error handling
        return list(x)


def flatten_and_cast_to_list(space, x):
    flattened_x = flatten(space, x)
    return cast_to_list(flattened_x)


def jsonize_dict(d):
    try:
        json_str = json.dumps(d)
    except:
        json_str = "{'error': 'The dictionary is not JSON serializable.'}"
    return json_str


def pickle_to_str(x):
    return base64.b64encode(pickle.dumps(x)).decode()


def unpickle_from_str(x):
    return pickle.loads(base64.b64decode(x))


def rgb_array_to_image_bytes(rgb_array: np.ndarray):
    image = Image.fromarray(rgb_array)
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="JPEG")
    image_bytes.seek(0)
    return image_bytes


def replace_special_chars_with_dash(s):
    # Replace all non-alphanumeric characters with a dash
    return re.sub(r"[^a-zA-Z0-9]", "-", s)


def generate_experiment_name():
    adjectives = [
        "fuzzy",
        "giant",
        "tiny",
        "swift",
        "clever",
        "brave",
        "shiny",
        "mighty",
        "quiet",
        "loud",
    ]
    colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "pink",
        "orange",
        "white",
        "black",
        "brown",
    ]
    animals = [
        "kangaroo",
        "lion",
        "penguin",
        "eagle",
        "dolphin",
        "elephant",
        "owl",
        "cheetah",
        "giraffe",
        "hippo",
    ]

    return (
        random.choice(adjectives)
        + "-"
        + random.choice(colors)
        + "-"
        + random.choice(animals)
    )


def is_docker_installed():
    try:
        subprocess.check_output(["docker", "--version"])
        return True
    except:
        return False


def update_or_append_env_var(var_name, new_value, env_file_path=".env", comment=None):
    """
    Updates or appends an environment variable in the specified .env file.

    Args:
    - var_name (str): The name of the environment variable.
    - new_value (str): The new value for the environment variable.
    - env_file_path (str): Path to the .env file. Default is ".env".

    Returns:
    - bool: True if operation was successful, False otherwise.
    """
    try:
        lines = []
        var_found = False

        # Read the existing .env file
        if os.path.exists(env_file_path):
            with open(env_file_path, "r") as file:
                for line in file:
                    if line.startswith(f"{var_name}="):
                        lines.append(f"{var_name}={new_value}\n")
                        var_found = True
                    else:
                        lines.append(line)

        # If the variable was not found, append it
        if not var_found:
            if comment:
                lines.append(f"# {comment}\n")
            lines.append(f"{var_name}={new_value}\n")

        # Write the updated lines back to the .env file
        with open(env_file_path, "w") as file:
            file.writelines(lines)

        return True

    except FileNotFoundError:
        # Handle the case where .env might not exist
        return False
