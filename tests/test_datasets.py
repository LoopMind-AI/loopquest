from loopquest.datasets import load_dataset, load_datasets
import gymnasium
from loopquest.gym_wrappers import LoopquestGymWrapper


def run_sim():
    name = "MountainCarContinuous-v0"
    experiment_name = "test"
    env = LoopquestGymWrapper(
        gymnasium.make(name, render_mode="rgb_array"),
        experiment_name,
    )
    obs, info = env.reset()
    for i in range(10):
        action = env.action_space.sample()
        obs, reward, terminated, truncated, info = env.step(action)
        rgb_array = env.render()
        if terminated or truncated:
            break
    env.close()
    return env.exp_id


def gen_datasets():
    exp_ids = [run_sim() for _ in range(3)]
    return exp_ids


def test_load_dataset():
    exp_id = run_sim()
    dataset = load_dataset(exp_id)
    for step in dataset:
        assert "observation" in step
        assert len(step["observation"]) > 0
        assert "images" in step

    dataset = load_dataset(exp_id, preload_images=True)
    for step in dataset:
        assert "images" in step


def test_load_datasets():
    exp_ids = gen_datasets()
    ds = load_datasets(exp_ids)
    for step in ds:
        assert "observation" in step
        assert len(step["observation"]) > 0
        assert "images" in step

    ds = load_datasets(exp_ids, preload_images=True)
    for step in ds:
        assert "images" in step


if __name__ == "__main__":
    test_load_dataset()
    test_load_datasets()
