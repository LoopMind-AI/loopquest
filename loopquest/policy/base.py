from ..typing import TensorStructType


class BasePolicy:
    def compute_action(self, observation: TensorStructType) -> TensorStructType:
        raise NotImplementedError
