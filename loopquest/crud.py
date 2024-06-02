from .schema import (
    Project,
    ProjectCreate,
    Experiment,
    ExperimentCreate,
    Step,
    ExperimentUpdate,
    EnvironmentCreate,
    EnvironmentUpdate,
    Environment,
)
from .env.space_utils import create_var_tree

# NOTE: the current requests are not async, which could be a performance bottle neck.
import requests
from .utils import (
    rgb_array_to_image_bytes,
    replace_special_chars_with_dash,
)
import numpy as np
import gymnasium
from PIL import Image
from io import BytesIO
from .private_api import TOKEN_ENV_VAR_NAME

import os
from requests.exceptions import HTTPError


def make_request(method: str, url: str, skip_auth_check=False, **kwargs):
    if not skip_auth_check:
        if TOKEN_ENV_VAR_NAME not in os.environ:
            raise Exception(
                f"Please run loopquest.init() before calling other loopquest functions."
            )
        headers = kwargs.get("headers", {})
        headers["Authorization"] = f"Bearer {os.getenv(TOKEN_ENV_VAR_NAME)}"
        kwargs["headers"] = headers

    try:
        response = requests.request(method, url, **kwargs)
        response.raise_for_status()
    except HTTPError as e:
        if e.response.status_code == 500:
            raise Exception(
                "The HTTP Error might be caused by invalid or expired token. Please run loopquest.init() again to refresh the token. If the problem persists, please contact the LoopQuest team."
            ) from e
        else:
            raise e
    return response


def send_instance_choice_stats(backend_url: str, is_local: bool):
    res = requests.post(
        f"{backend_url}/user_stats/instance_choice", params={"is_local": is_local}
    )
    res.raise_for_status()


def create_environment(backend_url: str, env: gymnasium.Env, user_id: str) -> str:
    environment = EnvironmentCreate(
        id=replace_special_chars_with_dash(env.spec.id),
        name=env.spec.name,
        namespace=env.spec.namespace,
        version=env.spec.version,
        metadata=env.metadata,
        gym_id=env.spec.id,
        user_id=user_id,
        env_spec=str(env.spec),
        observation_metadata=create_var_tree(env.observation_space, name="Obs"),
        action_metadata=create_var_tree(env.action_space, name="Act"),
        is_legacy_gym=False,
    )
    response = make_request("POST", f"{backend_url}/env", json=environment.model_dump())
    created_environment = response.json()
    return created_environment["id"]


def get_environment(backend_url: str, id: str):
    id = replace_special_chars_with_dash(id)
    response = make_request("GET", f"{backend_url}/env/{id}")
    data = response.json()
    env = Environment(**data)
    return env


def update_environment(backend_url: str, id: str, environment: EnvironmentUpdate):
    response = make_request(
        "PUT",
        f"{backend_url}/env/{id}",
        json=environment.model_dump(exclude_none=True),
    )
    environment = response.json()
    return environment["id"]


def get_or_create_environment(
    backend_url: str, env: gymnasium.Env, user_id: str
) -> str:
    try:
        env = get_environment(backend_url, env.spec.id)
        env_id = env.id
    except HTTPError as e:
        if e.response.status_code == 404:
            env_id = create_environment(backend_url, env, user_id)
        else:
            raise e
    return env_id


def get_project(backend_url: str, id: str) -> Project:
    response = make_request("GET", f"{backend_url}/project/{id}")
    project_dict = response.json()
    project = Project(**project_dict)
    return project


def get_project_by_name_and_user_id(
    backend_url: str, name: str, user_id: str
) -> Project | None:
    response = make_request("GET", f"{backend_url}/project/name/{name}/user/{user_id}")
    project_dict = response.json()
    project = Project(**project_dict)
    return project


def create_project(backend_url: str, project: ProjectCreate) -> Project:
    response = make_request("POST", f"{backend_url}/project", json=project.model_dump())
    project_dict = response.json()
    project = Project(**project_dict)
    return project


def add_experiment_to_project(backend_url: str, project_id: str, experiment_id: str):
    response = make_request(
        "PUT", f"{backend_url}/project/{project_id}/add/exp/{experiment_id}"
    )
    return response.status_code == 200


def get_or_create_project(
    backend_url: str,
    name: str,
    user_id: str,
    env_ids: list[str],
    description=None,
):
    try:
        project = get_project_by_name_and_user_id(backend_url, name, user_id)
    except HTTPError as e:
        if e.response.status_code == 404:
            project = create_project(
                backend_url,
                ProjectCreate(
                    name=name,
                    user_id=user_id,
                    environment_ids=env_ids,
                    description=description,
                ),
            )
        else:
            raise e
    if project.environment_ids != env_ids:
        raise Exception(
            f"Project with id {project.id} already exists, but the environment ids do not match, expected {env_ids}, got {project.environment_ids}."
        )
    return project


def create_experiment(
    backend_url: str,
    experiment: ExperimentCreate,
) -> Experiment:
    response = make_request("POST", f"{backend_url}/exp", json=experiment.model_dump())
    created_experiment = response.json()
    experiment = Experiment(**created_experiment)
    return experiment


def create_experiment_for_project(
    backend_url: str,
    project_id: str,
    user_id: str,
    name: str,
    env_ids: list[str],
    configs: dict = {},
    description: str = None,
    policy_filename: str = None,
    policy_repo_id: str = None,
    algorithm_name: str = None,
    num_episodes: int = None,
    num_steps: int = None,
):

    experiment = create_experiment(
        backend_url,
        ExperimentCreate(
            project_id=project_id,
            user_id=user_id,
            name=name,
            environment_ids=env_ids,
            description=description,
            configs=configs,
            policy_filename=policy_filename,
            policy_repo_id=policy_repo_id,
            algorithm_name=algorithm_name,
            num_episodes=num_episodes,
            num_steps=num_steps,
        ),
    )
    if not add_experiment_to_project(backend_url, project_id, experiment.id):
        raise Exception(
            f"Failed to add experiment with id {experiment.id} to project with id {project_id}."
        )
    return experiment


def get_experiment(backend_url: str, id: str) -> Experiment:
    response = make_request("GET", f"{backend_url}/exp/{id}")
    experiment_dict = response.json()
    experiment = Experiment(**experiment_dict)
    return experiment


def get_or_create_bundle(
    backend_url,
    user_id,
    gym_envs,
    project_name,
    project_description,
    experiment_name,
    experiment_description,
    experiment_configs,
    policy_filename=None,
    policy_repo_id=None,
    algorithm_name=None,
    num_episodes=None,
    num_steps=None,
):
    # NOTE: clound_env_id is the environment id in the backend, which is
    # different from the gym env id. It replaces special characters with "_".
    backend_env_ids = [
        get_or_create_environment(backend_url, env, user_id) for env in gym_envs
    ]

    project = get_or_create_project(
        backend_url,
        project_name,
        user_id,
        backend_env_ids,
        description=project_description,
    )

    experiment = create_experiment_for_project(
        backend_url,
        project.id,
        user_id,
        experiment_name,
        backend_env_ids,
        configs=experiment_configs,
        description=experiment_description,
        policy_filename=policy_filename,
        policy_repo_id=policy_repo_id,
        algorithm_name=algorithm_name,
        num_episodes=num_episodes,
        num_steps=num_steps,
    )
    return backend_env_ids, experiment


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
    return [Step(**s) for s in steps]


def get_image_by_id(backend_url: str, id: str):
    response = make_request("GET", f"{backend_url}/step/image/{id}")
    image = Image.open(BytesIO(response.content))
    return image


def get_image_ids_by_step(backend_url: str, step_id: str):
    response = make_request("GET", f"{backend_url}/step/{step_id}/image")
    image_ids = response.json()
    return image_ids


def get_cloud_user_id(backend_url: str):
    response = make_request("GET", f"{backend_url}/user_id")
    user_id = response.json()
    return user_id["userId"]
