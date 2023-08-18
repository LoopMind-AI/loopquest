import gymnasium
from .crud import (
    get_environment,
    create_environment,
    create_experiment,
    create_step,
    update_experiment,
    upload_rgb_as_image,
)
from .schema import (
    ExperimentCreate,
    StepCreate,
    ExperimentUpdate,
    ExperimentStatus,
)
from .utils import jsonize_dict, cast_to_list, flatten_and_cast_to_list


class LoopquestGymWrapper(gymnasium.Wrapper):
    def __init__(
        self,
        env: gymnasium.Env,
        frontend_url: str,
        backend_url: str,
        user_id: str,
        experiment_name: str = "default",
        experiment_description: str = "",
    ):
        super().__init__(env)
        self.current_step = 0
        self.current_episode = None
        self.prev_observation = None
        self.backend_url = backend_url
        self.user_id = user_id
        try:
            env_id = get_environment(self.backend_url, self.env.spec.id)
        except:
            env_id = create_environment(self.backend_url, self.env, self.user_id)

        self.exp_id = create_experiment(
            self.backend_url,
            ExperimentCreate(
                environment_id=env_id,
                user_id=self.user_id,
                name=experiment_name,
                description=experiment_description,
            ),
        )
        self.frontend_url = frontend_url
        print(
            f"Check the experiment progress at: {self.frontend_url}/experiment/{self.exp_id}"
        )

    @property
    def step_id(self):
        return f"{self.exp_id}-{self.current_episode}-{self.current_step}"

    def step(self, action):
        self.current_step += 1
        observation, reward, terminated, truncated, info = self.env.step(action)
        info_json_str = jsonize_dict(info)
        create_step(
            self.backend_url,
            StepCreate(
                id=self.step_id,
                experiment_id=self.exp_id,
                episode=self.current_episode,
                step=self.current_step,
                observation=flatten_and_cast_to_list(
                    self.observation_space, observation
                ),
                action=cast_to_list(action),
                reward=reward,
                prev_observation=flatten_and_cast_to_list(
                    self.observation_space, self.prev_observation
                ),
                termnated=terminated,
                truncated=truncated,
                info=info_json_str,
            ),
        )
        self.prev_observation = observation
        return observation, reward, terminated, truncated, info

    def reset(self):
        self.current_step = 0
        observation, info = self.env.reset()
        if self.current_episode is None:
            update_experiment(
                self.backend_url,
                self.exp_id,
                ExperimentUpdate(status=ExperimentStatus.RUNNING),
            )
            self.current_episode = 0
        # TODO: #4 support multiple episodes, the frontend is not ready yet.
        # else:
        #     self.current_episode += 1

        info_json_str = jsonize_dict(info)
        create_step(
            self.backend_url,
            StepCreate(
                id=self.step_id,
                experiment_id=self.exp_id,
                episode=self.current_episode,
                step=self.current_step,
                observation=flatten_and_cast_to_list(
                    self.observation_space, observation
                ),
                info=info_json_str,
            ),
        )
        self.prev_observation = observation
        return observation, info

    def close(self):
        update_experiment(
            self.backend_url,
            self.exp_id,
            ExperimentUpdate(status=ExperimentStatus.FINISHED),
        )
        self.env.close()

    def render(self):
        # TODO: implement this.
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
            step = upload_rgb_as_image(self.backend_url, self.step_id, rgb_array)
            return rgb_array
        elif self.render_mode == "rgb_array_list":
            rgb_array_list = self.env.render()
            for i, rgb_array in enumerate(rgb_array_list):
                upload_rgb_as_image(
                    self.backend_url, self.step_id, rgb_array, image_id=i
                )
            return rgb_array_list


# TODO: add a legacy gym wrapper
