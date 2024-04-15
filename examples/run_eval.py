from loopquest.eval import evaluate_local_policy, evaluate_remote_policy
from gymnasium.envs.registration import register
from loopquest.policy.sb3_policy import SB3Policy
from loopquest.policy.base import BasePolicy
from stable_baselines3 import PPO
import numpy as np
import gymnasium as gym


# def custom_reward(BG_last_hour):
#     if BG_last_hour[-1] > 180:
#         return -1
#     elif BG_last_hour[-1] < 70:
#         return -2
#     else:
#         return 1


# register(
#     id="simglucose/adolescent2-v0",
#     entry_point="simglucose.envs:T1DSimGymnaisumEnv",
#     max_episode_steps=10000,
#     kwargs={
#         "patient_name": "adolescent#002",
#         "reward_fun": custom_reward,
#     },
# )

# register(
#     id="simglucose/adolescent1-v0",
#     entry_point="simglucose.envs:T1DSimGymnaisumEnv",
#     max_episode_steps=10000,
#     kwargs={
#         "patient_name": "adolescent#001",
#         "reward_fun": custom_reward,
#     },
# )


# policy = SB3Policy.load(
#     "/home/jinyu/loopquest/experimental/stable_baseline3/ppo_simglucose_custom_reward_fun",
#     "PPO",
# )

# evaluate_local_policy(
#     policy,
#     ["simglucose/adolescent2-v0", "simglucose/adolescent1-v0"],
#     num_episodes=10,
#     num_steps_per_episode=2000,
#     project_name="test_simglucose",
# )


# evaluate_remote_policy(
#     "jxx123/ppo-LunarLander-v2",
#     "ppo-LunarLander-v2.zip",
#     "PPO",
#     ["LunarLander-v2"],
#     num_episodes=1,
#     num_steps_per_episode=5,
#     project_name="test_lunar_remote",
#     experiment_configs={"foo": [1, 2, 3], "bar": "hah", "bar": 1.1},
# )

# env = gym.make("FetchPickAndPlace-v2", render_mode="human")
# observation, info = env.reset(seed=42)
# for _ in range(1000):
#     # action = policy(observation)  # User-defined policy function
#     action = env.action_space.sample()
#     observation, reward, terminated, truncated, info = env.step(action)

#     if terminated or truncated:
#         observation, info = env.reset()
# env.close()


env = gym.make("FetchPickAndPlace-v2")
# env = gym.make("LunarLander-v2")


class RandomPolicy(BasePolicy):
    def __init__(self, action_space):
        self.action_space = action_space

    def compute_action(self, observation):
        return self.action_space.sample()


policy = RandomPolicy(env.action_space)

evaluate_local_policy(
    policy,
    [
        # "MountainCarContinuous-v0"
        # "LunarLander-v2",
        "FetchPickAndPlace-v2",
        "FetchPushDense-v2",
        "FetchReachDense-v2",
        "FetchSlideDense-v2",
    ],
    num_episodes=1,
    num_steps_per_episode=100,
    project_name="test_robotics_new",
)
