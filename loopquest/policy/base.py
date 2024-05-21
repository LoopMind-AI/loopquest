from ..typing import TensorStructType
import gymnasium


class BasePolicy:
    env: gymnasium.Env

    def set_env(self, env: gymnasium.Env):
        self.env = env

    def compute_action(self, observation: TensorStructType) -> TensorStructType:
        raise NotImplementedError
