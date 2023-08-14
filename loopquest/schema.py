from pydantic import BaseModel
from typing import List, Optional, Union
import datetime
from pydantic import BaseModel
import enum


Scalar = Union[float, int, str]


class ScalarInfo(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class VectorSpec(BaseModel):
    # Name is optional, and it is mostly useful for composite spaces
    # (https://gymnasium.farama.org/api/spaces/#composite-spaces).
    # If the vector is not composite, the name is unnecessary.
    name: Optional[str] = None
    space: str
    # All the observations or actions are flattened into a 1D array.
    size: int
    var_info: Optional[List[ScalarInfo]] = None


class EnvironmentCreate(BaseModel):
    # This could be gym id, [namespace/](env-name)[-v(version)].
    id: str
    name: Optional[str] = ""
    # Created by this user.
    user_id: str
    profile_image: Optional[str] = None
    gym_id: Optional[str] = None
    description: Optional[str] = None
    # JSON string of gym env spec
    # https://gymnasium.farama.org/api/registry/#gymnasium.envs.registration.EnvSpec
    env_spec: Optional[str] = None
    # Multiple VectorSpecs are used to represent composite spaces, e.g. Dict,
    # Tuple, Sequence etc.
    action_spec: Optional[List[VectorSpec]] = None
    observation_spec: Optional[List[VectorSpec]] = None
    reward_upper_limit: Optional[float] = None
    reward_lower_limit: Optional[float] = None
    git_repo: Optional[str] = None
    is_legacy_gym: Optional[bool] = False
    is_native_gym: Optional[bool] = True


class Environment(EnvironmentCreate):
    creation_time: datetime.datetime
    update_time: Optional[datetime.datetime] = None


class EnvironmentUpdate(EnvironmentCreate):
    id: Optional[str] = None
    name: Optional[str] = None
    user_id: Optional[str] = None


class Goal(BaseModel):
    text: str
    image: Optional[List[str]] = None  # image urls
    video: Optional[List[str]] = None  # video urls
    # This should be the consistent with observation_spec.
    observable_state: Optional[List[Scalar]] = None


# This client schema needs to be synced with the server schema.
class ExperimentCreate(BaseModel):
    # TODO: support multipe envs.
    environment_id: str
    user_id: str
    agent_id: Optional[str] = None
    num_episodes: Optional[int] = None
    num_steps: Optional[int] = None
    name: Optional[str] = None

    random_seed: Optional[int] = None
    environment_configs: Optional[str] = None  # JSON string of experiment configs
    agent_configs: Optional[str] = None  # JSON string of agent config
    goal: Optional[Goal] = None


class ExperimentStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    FINISHED = "finished"
    FAILED = "failed"


class Experiment(ExperimentCreate):
    id: str
    status: ExperimentStatus = ExperimentStatus.PENDING
    creation_time: datetime.datetime
    update_time: Optional[datetime.datetime] = None
    error_message: Optional[str] = None


class ExperimentUpdate(ExperimentCreate):
    status: Optional[ExperimentStatus] = ExperimentStatus.PENDING
    environment_id: Optional[str] = None
    agent_id: Optional[str] = None
    user_id: Optional[str] = None
    num_steps: Optional[int] = None
    error_message: Optional[str] = None


class StepCreate(BaseModel):
    experiment_id: str
    episode: int
    # In simulation, all the observations and actions are aligned in time.
    step: int
    # NOTE: observation and action are flattened into 1D arrays.
    observation: List[Scalar] = None
    action: Optional[List[Scalar]] = None
    reward: Optional[float] = 0.0
    # NOTE: even though this is redundant and suboptimal for space, it makes
    # the MDP transition complete and much more convenient for training.
    prev_observation: Optional[List[Scalar]] = None
    # This is potentially useful to train a policy conditioned on sub goals.
    sub_goal: Optional[Goal] = None
    image_urls: Optional[List[str]] = []
    termnated: Optional[bool] = False
    truncated: Optional[bool] = False
    # This is deprecated by Gymnasium, but we still keep it for backward
    # compatibility.
    done: Optional[bool] = False
    info: Optional[str] = None  # JSON string of step info


class Step(StepCreate):
    id: str
    creation_time: datetime.datetime
    update_time: Optional[datetime.datetime] = None


class StepUpdate(StepCreate):
    experiment_id: Optional[str] = None
    episode: Optional[int] = None
    # In simulation, all the observations and actions are aligned in time.
    step: Optional[int] = None
