from typing import Any
import gymnasium
from ..crud import (
    create_step,
    get_environment,
    update_environment,
    update_experiment,
    upload_rgb_as_image,
    get_image_by_url,
)
from ..schema import StepCreate, ExperimentUpdate, ExperimentStatus, EnvironmentUpdate
from ..utils import safe_jsonize
from .space_utils import construct_space_val
from ..api import get_backend_url
from concurrent.futures import ThreadPoolExecutor

BLOB_URL_PREFIX = "https://looquestdev.blob.core.windows.net/step-images"


class LoopquestGymWrapper(gymnasium.Wrapper):
    def __init__(
        self,
        env: gymnasium.Env,
        env_id: str,
        exp_id: str,
        episode: int = 0,
        use_thread_pool: bool = True,
        max_workers: int = 10,
        backend_url: str = None,
    ):
        super().__init__(env)
        self.current_step = 0
        self.episode = episode
        if backend_url is None:
            backend_url = get_backend_url()
        self.backend_url = backend_url
        self._env_id = env_id
        self._exp_id = exp_id
        self.use_thread_pool = use_thread_pool
        self.executor = None
        if self.use_thread_pool:
            # TODO: evaluate if message queue is better than thread pool.
            self.executor = ThreadPoolExecutor(max_workers=max_workers)

    @property
    def exp_id(self):
        return self._exp_id

    # NOTE: clound_env_id is the environment id in the backend, which is
    # different from the gym env id. It replaces special characters with "_".
    @property
    def cloud_env_id(self):
        return self._env_id

    @property
    def step_id(self):
        return f"{self.exp_id}-{self.cloud_env_id}-{self.episode}-{self.current_step}"

    def step(self, action):
        self.current_step += 1
        observation, reward, terminated, truncated, info = self.env.step(action)
        info_jsonable = safe_jsonize(info)
        # TODO: we can do batch upload here instead of uploading one by one.
        if self.use_thread_pool:
            self.executor.submit(
                create_step,
                self.backend_url,
                StepCreate(
                    id=self.step_id,
                    experiment_id=self.exp_id,
                    environment_id=self.cloud_env_id,
                    episode=self.episode,
                    step=self.current_step,
                    observation=construct_space_val(
                        self.observation_space, observation
                    ),
                    action=construct_space_val(self.action_space, action),
                    reward=reward,
                    termnated=terminated,
                    truncated=truncated,
                    info=info_jsonable,
                ),
            )
        else:
            create_step(
                self.backend_url,
                StepCreate(
                    id=self.step_id,
                    experiment_id=self.exp_id,
                    episode=self.current_episode,
                    step=self.current_step,
                    observation=construct_space_val(
                        self.observation_space, observation
                    ),
                    action=construct_space_val(self.action_space, action),
                    reward=reward,
                    termnated=terminated,
                    truncated=truncated,
                    info=info_jsonable,
                ),
            )
        return observation, reward, terminated, truncated, info

    def reset(self, seed: int | None = None, options: dict[str, Any] | None = None):
        self.current_step = 0
        observation, info = self.env.reset(seed=seed, options=options)
        # TODO: update status for each of the environment and episode.
        update_experiment(
            self.backend_url,
            self.exp_id,
            ExperimentUpdate(status=ExperimentStatus.RUNNING),
        )

        info_jsonable = safe_jsonize(info)
        self.executor.submit(
            create_step,
            self.backend_url,
            StepCreate(
                id=self.step_id,
                experiment_id=self.exp_id,
                environment_id=self.cloud_env_id,
                episode=self.episode,
                step=self.current_step,
                observation=construct_space_val(self.observation_space, observation),
                info=info_jsonable,
            ),
        )
        return observation, info

    def close(self):
        update_experiment(
            self.backend_url,
            self.exp_id,
            ExperimentUpdate(status=ExperimentStatus.FINISHED),
        )
        self._try_update_env_profile_image()
        self.env.close()
        self.executor.shutdown()
        # TODO: add a callback to compute custom metrics.

    def _try_update_env_profile_image(self):
        env_info = get_environment(self.backend_url, self.cloud_env_id)
        env_update = EnvironmentUpdate()
        if env_info.profile_image is None:
            step_id = f"{self.exp_id}-{self.cloud_env_id}-0-1"
            image_url = self.backend_url + f"/step/{step_id}/image/0"
            try:
                img = get_image_by_url(image_url)
                env_update.profile_image = f"{BLOB_URL_PREFIX}/{step_id}-0.jpg"
            except Exception as e:
                return
        update_environment(self.backend_url, self.cloud_env_id, env_update)

    def render(self):
        if self.render_mode == "human":
            raise ValueError(
                "'human' mode is not supported for cloud rendering. Please use other render mode."
            )
        elif self.render_mode in ["ansi", "ansi_list"]:
            raise ValueError(
                "'ansi' or 'ansi_list' mode is not supported for cloud rendering yet."
            )
        elif self.render_mode == "rgb_array":
            rgb_array = self.env.render()
            self.executor.submit(
                upload_rgb_as_image, self.backend_url, self.step_id, rgb_array
            )
            return rgb_array
        elif self.render_mode == "rgb_array_list":
            rgb_array_list = self.env.render()
            for i, rgb_array in enumerate(rgb_array_list):
                self.executor.submit(
                    upload_rgb_as_image,
                    self.backend_url,
                    self.step_id,
                    rgb_array,
                    image_id=i,
                )
            return rgb_array_list
