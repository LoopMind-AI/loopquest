import gymnasium as gym

from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env
from huggingface_sb3 import package_to_hub

# Create the environment
env_id = "LunarLander-v2"
env = make_vec_env(env_id, n_envs=1)

# Create the evaluation env
eval_env = make_vec_env(env_id, n_envs=1)

# Instantiate the agent
model = PPO("MlpPolicy", env, verbose=1)

# Train the agent
model.learn(total_timesteps=int(5000))

# This method save, evaluate, generate a model card and record a replay video of your agent before pushing the repo to the hub
package_to_hub(
    model=model,
    model_name="ppo-LunarLander-v2",
    model_architecture="PPO",
    env_id=env_id,
    eval_env=eval_env,
    repo_id="jxx123/ppo-LunarLander-v2",
    commit_message="Test commit",
)
