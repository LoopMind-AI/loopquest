import numpy as np
import json
import base64
import pickle
from gymnasium.spaces.utils import flatten
import io
from PIL import Image
import re


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
