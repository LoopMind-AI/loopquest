import gymnasium
from loopquest.gym_wrappers import LoopquestGymWrapper


def test_gymnasium_wrapper():
    name = "MountainCarContinuous-v0"
    experiment_name = "test"
    env = LoopquestGymWrapper(
        gymnasium.make(name, render_mode="rgb_array"),
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


if __name__ == "__main__":
    test_gymnasium_wrapper()
