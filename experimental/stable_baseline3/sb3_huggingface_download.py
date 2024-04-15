import gymnasium as gym

from huggingface_sb3 import load_from_hub
from stable_baselines3 import PPO
from stable_baselines3.common.evaluation import evaluate_policy

# Retrieve the model from the hub
## repo_id = id of the model repository from the Hugging Face Hub (repo_id = {organization}/{repo_name})
## filename = name of the model zip file from the repository including the extension .zip
checkpoint = load_from_hub(
    repo_id="jxx123/ppo-LunarLander-v2",
    filename="ppo-LunarLander-v2.zip",
)
print(checkpoint)
model = PPO.load(checkpoint)

# Evaluate the agent and watch it
eval_env = gym.make("LunarLander-v2")
mean_reward, std_reward = evaluate_policy(
    model, eval_env, render=True, n_eval_episodes=5, deterministic=True, warn=False
)
print(f"mean_reward={mean_reward:.2f} +/- {std_reward}")
