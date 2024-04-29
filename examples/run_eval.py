import loopquest
from loopquest.eval import evaluate_local_policy, evaluate_remote_policy
from gymnasium.envs.registration import register
from loopquest.policy.sb3_policy import SB3Policy
from loopquest.policy.base import BasePolicy
from stable_baselines3 import PPO
import numpy as np
import gymnasium as gym


loopquest.init()


# Cloud evaluation example
evaluate_remote_policy(
    "jxx123/ppo-LunarLander-v2",
    "ppo-LunarLander-v2.zip",
    "PPO",
    ["LunarLander-v2"],
    num_episodes=1,
    num_steps_per_episode=100,
    project_name="test_lunar_remote",
    experiment_configs={"foo": [1, 2, 3], "bar": "hah", "bar": 1.1},
)

# Local evaluation example
env = gym.make("FetchPickAndPlace-v2")


class RandomPolicy(BasePolicy):
    def __init__(self, action_space):
        self.action_space = action_space

    def compute_action(self, observation):
        return self.action_space.sample()


policy = RandomPolicy(env.action_space)

evaluate_local_policy(
    policy,
    [
        "FetchPickAndPlace-v2",
        "FetchPushDense-v2",
        "FetchReachDense-v2",
        "FetchSlideDense-v2",
    ],
    num_episodes=1,
    num_steps_per_episode=100,
    project_name="test_robotics_new",
)
