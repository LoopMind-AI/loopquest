import loopquest
from loopquest.eval import evaluate_local_policy
from loopquest.policy.base import BasePolicy
import gymnasium as gym


class RandomPolicy(BasePolicy):

    def compute_action(self, observation):
        return self.action_space.sample()


policy = RandomPolicy()

loopquest.init()
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
