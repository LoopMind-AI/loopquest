import loopquest
from gymnasium.envs.registration import register

register(
    id="simglucose/adolescent2-v0",
    entry_point="simglucose.envs:T1DSimGymnaisumEnv",
    kwargs={"patient_name": "adolescent#002"},
)

loopquest.init()
env = loopquest.make_env(
    "simglucose/adolescent2-v0", experiment_name="Exp A", project_name="simglucose_test"
)
obs, info = env.reset()
for i in range(100):
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        break
env.close()
