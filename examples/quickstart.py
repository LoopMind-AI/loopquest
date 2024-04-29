import loopquest

loopquest.init()
env = loopquest.make_env("MountainCarContinuous-v0", render_mode="rgb_array")
obs, info = env.reset()
for i in range(100):
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    rgb_array = env.render()
    if terminated or truncated:
        break
env.close()
