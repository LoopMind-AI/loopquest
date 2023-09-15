import gymnasium
import loopquest
from unittest.mock import patch


def test_gymnasium_wrapper():
    name = "MountainCarContinuous-v0"
    with patch("builtins.input", return_value="2"):
        env = loopquest.make_env(gymnasium.make(name, render_mode="rgb_array"))
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


if __name__ == "__main__":
    test_gymnasium_wrapper()
