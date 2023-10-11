import gymnasium
import loopquest
from gymnasium.envs.registration import register

register(
    id="simglucose/adolescent2-v0",
    entry_point="simglucose.envs:T1DSimGymnaisumEnv",
    kwargs={"patient_name": "adolescent#002"},
)

env = loopquest.make_env(gymnasium.make("simglucose/adolescent2-v0"))
obs, info = env.reset()
for i in range(100):
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        break
env.close()
