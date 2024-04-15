from typing import List, Optional, Union, Any, Dict
import datetime
from pydantic import BaseModel, Json
import enum


Scalar = Union[float, int, str]


class VarNode(BaseModel):
    # This path is used by the api for the value retrieval.
    path: Optional[str] = None
    # This path represents the path from the root to this node in the VarNode
    # tree.
    tree_path: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    spec: Optional[str] = None
    children: Optional[List["VarNode"]] = []


class NumpyLike(BaseModel):
    shape: List[int] = []
    value: List[int | float] = []
    type: str = None


class SpaceVal(BaseModel):
    spec: str = None
    # Discrete (int), Text (str), Box/MultiBinary/MultiDiscrete (NumpyLike) values are saved here.
    value: Optional[int | float | str | NumpyLike] = None
    # Only Sequence values are saved here.
    seq: Optional[List["SpaceVal"]] = None
    # Dict, Tuple (keyed by index string) and Graph values are saved here.
    dic: Optional[Dict[str, "SpaceVal"]] = None


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
    action_metadata: Optional[VarNode] = None
    observation_metadata: Optional[VarNode] = None
    git_repo: Optional[str] = None


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


class ProjectCreate(BaseModel):
    name: str
    user_id: str
    description: Optional[str] = None
    experiment_ids: Optional[List[str]] = []
    experiment_names: Optional[List[str]] = []
    environment_ids: Optional[List[str]] = []


class Project(ProjectCreate):
    id: str
    creation_time: datetime.datetime
    update_time: Optional[datetime.datetime] = None


class ProjectUpdate(ProjectCreate):
    name: Optional[str] = None
    user_id: Optional[str] = None


# This client schema needs to be synced with the server schema.
class ExperimentCreate(BaseModel):
    environment_ids: Optional[List[str]] = []
    project_id: Optional[str] = None
    user_id: str
    policy_repo_id: Optional[str] = None
    policy_filename: Optional[str] = None
    algorithm_name: Optional[str] = None
    num_episodes: Optional[int] = None
    num_steps: Optional[int] = None
    name: Optional[str] = None
    random_seed: Optional[int] = None
    configs: Optional[Dict[str, Any]] = None


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
    environment_ids: Optional[List[str]] = None
    agent_id: Optional[str] = None
    project_id: Optional[str] = None
    user_id: Optional[str] = None
    num_steps: Optional[int] = None
    error_message: Optional[str] = None


class StepCreate(BaseModel):
    experiment_id: str
    environment_id: str
    episode: int
    # In simulation, all the observations and actions are aligned in time.
    step: int
    # NOTE: observation and action are flattened into 1D arrays.
    observation: Optional[SpaceVal] = None
    action: Optional[SpaceVal] = None
    reward: Optional[float] = 0.0
    # This is potentially useful to train a policy conditioned on sub goals.
    sub_goal: Optional[Goal] = None
    image_urls: Optional[List[str]] = []
    termnated: Optional[bool] = False
    truncated: Optional[bool] = False
    # This is deprecated by Gymnasium, but we still keep it for backward
    # compatibility.
    done: Optional[bool] = False
    info: Optional[Dict[str, Any]] = None  # JSON string of step info


class Step(StepCreate):
    id: str
    creation_time: datetime.datetime
    update_time: Optional[datetime.datetime] = None


class StepUpdate(StepCreate):
    experiment_id: Optional[str] = None
    environment_id: Optional[str] = None
    episode: Optional[int] = None
    # In simulation, all the observations and actions are aligned in time.
    step: Optional[int] = None


class EvalRequest(BaseModel):
    huggingface_repo_id: str
    huggingface_filename: str
    algorithm_name: str
    env_ids: list[str]
    num_episodes: int = 10
    num_steps_per_episode: int = 1000
    project_name: str = None
    project_description: str = None
    experiment_name: str = None
    experiment_description: str = ""
    experiment_configs: dict[str, Any] = None
    use_thread_pool: bool = True
    max_workers: int = 10
