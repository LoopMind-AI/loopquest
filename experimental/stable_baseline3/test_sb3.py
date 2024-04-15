import gymnasium as gym
from gymnasium.envs.registration import register
from stable_baselines3 import PPO
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.vec_env import SubprocVecEnv, DummyVecEnv


def custom_reward(BG_last_hour):
    if BG_last_hour[-1] > 180:
        return -1
    elif BG_last_hour[-1] < 70:
        return -2
    else:
        return 1


register(
    id="simglucose/adolescent2-v0",
    entry_point="simglucose.envs:T1DSimGymnaisumEnv",
    max_episode_steps=10000,
    kwargs={
        "patient_name": "adolescent#002",
        "reward_fun": custom_reward,
    },
)

register(
    id="simglucose/adolescent1-v0",
    entry_point="simglucose.envs:T1DSimGymnaisumEnv",
    max_episode_steps=10000,
    kwargs={
        "patient_name": "adolescent#001",
        "reward_fun": custom_reward,
    },
)


# Create environment
# env = gym.make("LunarLander-v2", render_mode="rgb_array")

# env1 = gym.make("simglucose/adolescent2-v0", render_mode="human")
# env2 = gym.make("simglucose/adolescent1-v0", render_mode="human")
vec_env = DummyVecEnv(
    [
        lambda: gym.make("simglucose/adolescent2-v0", render_mode="human"),
        lambda: gym.make("simglucose/adolescent1-v0", render_mode="human"),
    ]
)

# # Instantiate the agent
# # model = DQN("MlpPolicy", env, verbose=1)
# model = PPO("MlpPolicy", env, verbose=1, tensorboard_log="./ppo_simglucose_tb/")
# model.learn(
#     total_timesteps=int(1e7), progress_bar=True, tb_log_name="custom_reward_fun"
# )
# model.save("ppo_simglucose")

# # # Train the agent and display a progress bar
# # model.learn(total_timesteps=int(2e5), progress_bar=True)
# # # Save the agent
# model.save("ppo_simglucose_custom_reward_fun")
# del model  # delete trained model to demonstrate loading

# Load the trained agent
# NOTE: if you have loading issue, you can pass `print_system_info=True`
# to compare the system on which the model was trained vs the current one
# model = DQN.load("dqn_lunar", env=env, print_system_info=True)
# model = DQN.load("dqn_lunar", env=env)
model = PPO.load(
    "/home/jinyu/loopquest/experimental/stable_baseline3/ppo_simglucose_custom_reward_fun"
)
# model = OffPolicyAlgorithm.load("ppo_simglucose_custom_reward_fun", env=env)

# Evaluate the agent
# NOTE: If you use wrappers with your environment that modify rewards,
#       this will be reflected here. To evaluate with original rewards,
#       wrap environment in a "Monitor" wrapper before other wrappers.
# mean_reward, std_reward = evaluate_policy(model, model.get_env(), n_eval_episodes=10)
# print(f"Reward: {mean_reward} +/- {std_reward:.2f}")


# mean_reward, std_reward = evaluate_policy(model, vec_env, n_eval_episodes=10)
# print(mean_reward, std_reward)

# Enjoy trained agent
# vec_env = model.get_env()
obs = vec_env.reset()
print(f"OBSERVATION: {obs}")
for i in range(1000):
    action, _states = model.predict(obs, deterministic=True)
    print(f"ACTION: {action}")
    obs, rewards, dones, info = vec_env.step(action)
    vec_env.render("human")
