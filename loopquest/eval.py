from .policy.base import BasePolicy
from typing import Any
import gymnasium as gym
from .utils import generate_experiment_name, generate_project_name
from .api import get_user_id, get_backend_url, get_frontend_url
from .crud import get_or_create_bundle
from .env.gym_wrappers import LoopquestGymWrapper
from .policy.sb3_policy import SB3Policy
from tqdm import tqdm
from huggingface_sb3 import load_from_hub


def evaluate_local_policy(
    policy: BasePolicy,
    env_ids: list[str],
    num_episodes: int = 10,
    num_steps_per_episode: int = 1000,
    project_name: str = None,
    project_description: str = None,
    experiment_name: str = None,
    experiment_description: str = "",
    experiment_configs: dict[str, Any] = None,
    policy_filename: str = None,
    policy_repo_id: str = None,
    algorithm_name: str = None,
    use_thread_pool: bool = True,
    max_workers: int = 10,
    disable_progress_bar: bool = False,
):

    gym_envs = [gym.make(env_id) for env_id in env_ids]
    if all(["rgb_array" in env.metadata.get("render_modes", []) for env in gym_envs]):
        render_mode = "rgb_array"
    elif all(
        ["rgb_array_list" in env.metadata.get("render_modes", []) for env in gym_envs]
    ):
        render_mode = "rgb_array_list"
    else:
        raise ValueError(
            "All the environments must support rgb_array or rgb_array_list."
        )
    gym_envs = [gym.make(env_id, render_mode=render_mode) for env_id in env_ids]

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
        policy_filename=policy_filename,
        policy_repo_id=policy_repo_id,
        algorithm_name=algorithm_name,
        num_episodes=num_episodes,
        num_steps=num_steps_per_episode,
    )

    frontend_url = get_frontend_url()
    print(
        f"Check the results of experiment {experiment.name} at: {frontend_url}/project/{experiment.project_id}?exp_id={experiment.id}"
    )

    # TODO: the dummy for loop can be replaced by parallelism.
    for eps in tqdm(range(num_episodes), desc="Episodes", disable=disable_progress_bar):
        # NOTE: we did not use vec env because vec env requires all the envs run
        # to the same time steps, but envs terminate at different time steps.
        for env_id, backend_env_id in tqdm(
            zip(env_ids, backend_env_ids),
            total=len(gym_envs),
            desc="Environments",
            leave=False,
            disable=disable_progress_bar,
        ):
            env = LoopquestGymWrapper(
                # NOTE: Making env every time to avoid the env state being
                # changed and renderer does not work as expected etc., but this
                # might hurt performance.
                gym.make(env_id, render_mode=render_mode),
                backend_env_id,
                experiment.id,
                episode=eps,
                use_thread_pool=use_thread_pool,
                max_workers=max_workers,
            )

            obs, info = env.reset()
            for _ in tqdm(
                range(num_steps_per_episode),
                desc="Steps",
                leave=False,
                disable=disable_progress_bar,
            ):
                action = policy.compute_action(obs)
                obs, reward, terminated, truncated, info = env.step(action)
                if render_mode in ["rgb_array", "rgb_array_list"]:
                    env.render()
                if terminated or truncated:
                    break
            env.close()


# Only supports stable baseline3 policies in huggingface for now.
def evaluate_remote_policy(
    huggingface_repo_id: str,
    huggingface_filename: str,
    algorithm_name: str,
    env_ids: list[str],
    num_episodes: int = 10,
    num_steps_per_episode: int = 1000,
    project_name: str = None,
    project_description: str = None,
    experiment_name: str = None,
    experiment_description: str = "",
    experiment_configs: dict[str, Any] = None,
    use_thread_pool: bool = True,
    max_workers: int = 10,
):
    checkpoint = load_from_hub(
        repo_id=huggingface_repo_id,
        filename=huggingface_filename,
    )
    policy = SB3Policy.load(checkpoint, algorithm_name)
    evaluate_local_policy(
        policy,
        env_ids,
        num_episodes=num_episodes,
        num_steps_per_episode=num_steps_per_episode,
        project_name=project_name,
        project_description=project_description,
        experiment_name=experiment_name,
        experiment_description=experiment_description,
        experiment_configs=experiment_configs,
        use_thread_pool=use_thread_pool,
        max_workers=max_workers,
        policy_filename=huggingface_filename,
        policy_repo_id=huggingface_repo_id,
        algorithm_name=algorithm_name,
    )
