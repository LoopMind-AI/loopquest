from typing import Any
from ..crud import get_or_create_bundle
from ..api import initailize, get_user_id, get_backend_url
from .gym_wrappers import LoopquestGymWrapper
from ..utils import generate_experiment_name, generate_project_name
import gymnasium as gym
from stable_baselines3.common.vec_env import VecEnv, DummyVecEnv


@initailize
def make_env(
    env_id: str,
    project_name: str = None,
    project_description: str = None,
    experiment_name: str = None,
    experiment_description: str = "",
    experiment_configs: dict[str, Any] = None,
    episode: int = 0,
    use_thread_pool: bool = True,
    max_workers: int = 10,
    **kwargs,
) -> LoopquestGymWrapper:
    """
    Creates a Loopquest environment.

    Args:
        env_id (str): The OpenAI Gym environment id to be used.
        project_id (str, optional): The ID of the project to associate the environment with. If not provided, a new project will be created.
        project_name (str, optional): The name of the project to create if `project_id` is not provided. If not provided, a random name will be generated.
        project_description (str, optional): The description of the project.
        experiment_id (str, optional): The ID of the experiment to associate the environment with. If not provided, a new experiment will be created.
        experiment_name (str, optional): The name of the experiment to create if `experiment_id` is not provided. If not provided, a random name will be generated.
        experiment_description (str, optional): The description of the experiment.
        experiment_configs (dict[str, Any], optional): Additional configurations for the experiment.
        **kwargs: Additional keyword arguments to be passed to the Gymnasium.make constructor.

    Returns:
        LoopquestGymWrapper: The Loopquest environment wrapped with the LoopquestGymWrapper.

    Raises:
        Exception: If the experiment is already added to another project or if adding the experiment to the project fails.
    """
    env = gym.make(env_id, **kwargs)

    if project_name is None:
        project_name = generate_project_name()

    if experiment_name is None:
        experiment_name = generate_experiment_name()

    backend_env_ids, experiment = get_or_create_bundle(
        get_backend_url(),
        get_user_id(),
        [env],
        project_name,
        project_description,
        experiment_name,
        experiment_description,
        experiment_configs,
    )
    return LoopquestGymWrapper(
        env,
        backend_env_ids[0],
        experiment.id,
        episode=episode,
        use_thread_pool=use_thread_pool,
        max_workers=max_workers,
    )


@initailize
def make_vec_env(
    env_ids: str,
    project_name: str = None,
    project_description: str = None,
    experiment_name: str = None,
    experiment_description: str = "",
    experiment_configs: dict[str, Any] = None,
    episode: int = 0,
    use_thread_pool: bool = True,
    max_workers: int = 10,
    **kwargs,
) -> VecEnv:
    gym_envs = [gym.make(env_id, **kwargs) for env_id in env_ids]

    if project_name is None:
        project_name = generate_project_name()

    if experiment_name is None:
        experiment_name = generate_experiment_name()
    backend_env_ids, experiment = get_or_create_bundle(
        get_backend_url(),
        get_user_id(),
        gym_envs,
        project_name,
        project_description,
        experiment_name,
        experiment_description,
        experiment_configs,
    )

    env_fun = lambda env, backend_env_id: LoopquestGymWrapper(
        env,
        backend_env_id,
        experiment.id,
        episode=episode,
        use_thread_pool=use_thread_pool,
        max_workers=max_workers,
    )
    return DummyVecEnv(
        [
            lambda: env_fun(env, backend_env_id)
            for env, backend_env_id in zip(gym_envs, backend_env_ids)
        ]
    )
