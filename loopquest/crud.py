from .schema import (
    ExperimentCreate,
    Step,
    ExperimentUpdate,
    EnvironmentCreate,
    VectorSpec,
    ScalarInfo,
)

# NOTE: the current requests are not async, which could be a performance bottle neck.
import requests
from .utils import rgb_array_to_image_bytes, replace_special_chars_with_dash
import numpy as np
import gymnasium
from PIL import Image
from io import BytesIO
from .private_api import is_local_instance_initialized, TOKEN_ENV_VAR_NAME
from dotenv import load_dotenv
import os

load_dotenv()


def make_request(method: str, url: str, **kwargs):
    if not is_local_instance_initialized():
        if TOKEN_ENV_VAR_NAME not in os.environ:
            raise Exception(
                f"Please set {TOKEN_ENV_VAR_NAME} environment variable to use LoopQuest cloud service."
            )
        headers = kwargs.get("headers", {})
        headers["Authorization"] = f"Bearer {os.getenv(TOKEN_ENV_VAR_NAME)}"
        kwargs["headers"] = headers

    response = requests.request(method, url, **kwargs)
    response.raise_for_status()
    return response


def send_instance_choice_stats(backend_url: str, is_local: bool):
    res = requests.post(
        f"{backend_url}/user_stats/instance_choice", params={"is_local": is_local}
    )
    res.raise_for_status()


def construct_environment_info(env: gymnasium.Env, user_id: str):
    def get_size_of_gym_space(space):
        return max(sum(space.shape), 1)

    flattened_env = gymnasium.wrappers.FlattenObservation(env)
    obs_size = get_size_of_gym_space(flattened_env.observation_space)
    observation_spec = [
        VectorSpec(
            space=str(env.observation_space),
            size=obs_size,
            var_info=[ScalarInfo()] * obs_size,
        )
    ]
    action_size = get_size_of_gym_space(flattened_env.action_space)
    action_spec = [
        VectorSpec(
            space=str(env.action_space),
            size=action_size,
            var_info=[ScalarInfo()] * action_size,
        )
    ]
    return EnvironmentCreate(
        id=replace_special_chars_with_dash(env.spec.id),
        name=env.spec.id,
        gym_id=env.spec.id,
        user_id=user_id,
        env_spec=str(env.spec),
        observation_spec=observation_spec,
        action_spec=action_spec,
        is_legacy_gym=False,
    )


def create_environment(backend_url: str, env: gymnasium.Env, user_id: str) -> str:
    environment = construct_environment_info(env, user_id)
    response = make_request("POST", f"{backend_url}/env", json=environment.model_dump())
    created_environment = response.json()
    return created_environment["id"]


def get_environment(backend_url: str, id: str):
    id = replace_special_chars_with_dash(id)
    response = make_request("GET", f"{backend_url}/env/{id}")
    environment = response.json()
    return environment["id"]


def create_experiment(
    backend_url: str,
    experiment: ExperimentCreate,
) -> str:
    # TODO: get rid of the tailing slash.
    response = make_request("POST", f"{backend_url}/exp/", json=experiment.model_dump())
    created_experiment = response.json()
    return created_experiment["id"]


def update_experiment(
    backend_url: str, experiment_id: str, experiment: ExperimentUpdate
):
    # experiment could include field with None values, which should be excluded.
    response = make_request(
        "PUT",
        f"{backend_url}/exp/{experiment_id}",
        json=experiment.model_dump(exclude_none=True),
    )
    updated_experiment = response.json()
    return updated_experiment


def create_step(backend_url: str, step: Step):
    response = make_request("POST", f"{backend_url}/step", json=step.model_dump())
    created_step = response.json()
    return created_step


def upload_rgb_as_image(
    backend_url: str, step_id: str, rgb_array: np.ndarray, image_id: int = 0
):
    image_bytes = rgb_array_to_image_bytes(rgb_array)
    files = {"image": (f"{step_id}-{image_id}.jpg", image_bytes, "image/jpeg")}
    response = make_request(
        "POST", f"{backend_url}/step/{step_id}/image/{image_id}", files=files
    )
    step = response.json()
    return step


def get_steps_by_experiment(backend_url: str, experiment_id: str):
    response = make_request("GET", f"{backend_url}/step/exp/{experiment_id}")
    steps = response.json()
    return steps


def get_image_by_url(image_url: str):
    response = make_request("GET", image_url)
    image = Image.open(BytesIO(response.content))
    return image


def get_cloud_user_id(backend_url: str):
    response = make_request("GET", f"{backend_url}/user_id")
    user_id = response.json()
    return user_id["userId"]
