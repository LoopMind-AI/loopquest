from ..typing import TensorStructType
from gymnasium import Space


class BasePolicy:
    action_space: Space

    def set_action_space(self, action_space: Space):
        self.action_space = action_space

    def compute_action(self, observation: TensorStructType) -> TensorStructType:
        raise NotImplementedError
