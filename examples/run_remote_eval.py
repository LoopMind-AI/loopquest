import loopquest
from loopquest.eval import evaluate_remote_policy


loopquest.init()
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
