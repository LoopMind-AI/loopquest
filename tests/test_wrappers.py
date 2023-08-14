import gymnasium
from loopquest.gym_wrappers import LoopquestGymWrapper


def test_gymnasium_wrapper():
    name = "MountainCarContinuous-v0"
    frontend_url = "http://localhost:3000"
    backend_url = "http://localhost:8000"
    user_id = "jinyuxie"
    experiment_name = "test"
    env = LoopquestGymWrapper(
        gymnasium.make(name, render_mode="rgb_array"),
        frontend_url,
        backend_url,
        user_id,
        experiment_name,
    )
    obs, info = env.reset()
    print(f"Reset: obs: {obs}, info: {info}")
    for i in range(10):
        action = env.action_space.sample()
        print(f"action: {action}")
        obs, reward, terminated, truncated, info = env.step(action)
        rgb_array = env.render()
        print(
            f"Step {i}: obs: {obs}, reward: {reward}, terminated: {terminated}, truncated: {truncated}, info: {info}"
        )
        if terminated or truncated:
            break
    env.close()
    assert True
