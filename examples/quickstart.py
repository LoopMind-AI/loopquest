import gymnasium
from loopquest.gym_wrappers import LoopquestGymWrapper

frontend_url = "http://localhost:3000"
backend_url = "http://localhost:8000"
user_id = "dope_robotics_hacker"
experiment_name = "a test"
env = LoopquestGymWrapper(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array"),
    frontend_url,
    backend_url,
    user_id,
    experiment_name,
)
obs, info = env.reset()
for i in range(100):
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    rgb_array = env.render()
    if terminated or truncated:
        break
env.close()
