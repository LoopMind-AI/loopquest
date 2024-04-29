from .base import BasePolicy
from stable_baselines3.common.base_class import BaseAlgorithm as SB3BaseAlgorithm
from stable_baselines3.common.policies import BasePolicy as SB3BasePolicy


class SB3Policy(BasePolicy):
    model: SB3BaseAlgorithm | SB3BasePolicy

    def __init__(self, model: SB3BaseAlgorithm | SB3BasePolicy):
        self.model = model

    def compute_action(self, observation):
        if self.model is None:
            raise ValueError("Model is not loaded")
        action, _ = self.model.predict(observation)
        return action

    @classmethod
    def load(cls, path: str, algorithm: str):
        assert algorithm in [
            "PPO",
            "DQN",
            "SAC",
            "TD3",
        ], "Algorithm must be one of 'PPO', 'DQN', 'SAC', or 'TD3'"
        algorithm = algorithm

        if algorithm == "PPO":
            from stable_baselines3 import PPO

            return cls(PPO.load(path))
        elif algorithm == "DQN":
            from stable_baselines3 import DQN

            return cls(DQN.load(path))
        elif algorithm == "SAC":
            from stable_baselines3 import SAC

            return cls(SAC.load(path))
        elif algorithm == "TD3":
            from stable_baselines3 import TD3

            return cls(TD3.load(path))
        else:
            raise ValueError(f"Algorithm {algorithm} is not supported")
