import gymnasium
import loopquest
from unittest.mock import patch
import time

STEP = 100


def test_step_local():
    name = "MountainCarContinuous-v0"
    with patch("builtins.input", return_value="2"):
        env = loopquest.make_env(gymnasium.make(name, render_mode="rgb_array"))
    obs, info = env.reset()
    step_times = []
    render_times = []
    for i in range(STEP):
        action = env.action_space.sample()
        start_time = time.time()
        obs, reward, terminated, truncated, info = env.step(action)
        elapsed_time = time.time() - start_time
        step_times.append(elapsed_time)

        start_time = time.time()
        env.render()
        elapsed_time = time.time() - start_time
        render_times.append(elapsed_time)

        if terminated or truncated:
            break
    env.close()
    loopquest.close()
    with_loopquest_step_time = sum(step_times) / len(step_times)
    with_loopquest_render_time = sum(render_times) / len(render_times)
    print(f"With Loopquest Average step time: {with_loopquest_step_time}")
    print(f"Without Loopquest Average render time: {with_loopquest_render_time}")

    env = gymnasium.make(name, render_mode="rgb_array")
    obs, info = env.reset()
    step_times = []
    render_times = []
    for i in range(STEP):
        action = env.action_space.sample()
        start_time = time.time()
        obs, reward, terminated, truncated, info = env.step(action)
        elapsed_time = time.time() - start_time
        step_times.append(elapsed_time)

        start_time = time.time()
        env.render()
        elapsed_time = time.time() - start_time
        render_times.append(elapsed_time)

        if terminated or truncated:
            break
    env.close()
    without_loopquest_step_time = sum(step_times) / len(step_times)
    without_loopquest_render_time = sum(render_times) / len(render_times)
    print(f"With Loopquest Average step time: {without_loopquest_step_time}")
    print(f"Without Loopquest Average render time: {without_loopquest_render_time}")

    print(
        f"LoopQuest step overhead: {with_loopquest_step_time - without_loopquest_step_time}"
    )
    print(
        f"LoopQuest render overhead: {with_loopquest_render_time - without_loopquest_render_time}"
    )
    assert True


# def test_step_cloud():
#     name = "MountainCarContinuous-v0"
#     with patch("builtins.input", return_value="1"):
#         env = loopquest.make_env(gymnasium.make(name, render_mode="rgb_array"))
#     obs, info = env.reset()
#     step_times = []
#     render_times = []
#     for i in range(STEP):
#         action = env.action_space.sample()
#         start_time = time.time()
#         obs, reward, terminated, truncated, info = env.step(action)
#         elapsed_time = time.time() - start_time
#         step_times.append(elapsed_time)

#         start_time = time.time()
#         env.render()
#         elapsed_time = time.time() - start_time
#         render_times.append(elapsed_time)

#         if terminated or truncated:
#             break
#     env.close()
#     loopquest.close()
#     with_loopquest_step_time = sum(step_times) / len(step_times)
#     with_loopquest_render_time = sum(render_times) / len(render_times)
#     print(f"With Loopquest Average step time: {with_loopquest_step_time}")
#     print(f"Without Loopquest Average render time: {with_loopquest_render_time}")

#     env = gymnasium.make(name, render_mode="rgb_array")
#     obs, info = env.reset()
#     step_times = []
#     render_times = []
#     for i in range(STEP):
#         action = env.action_space.sample()
#         start_time = time.time()
#         obs, reward, terminated, truncated, info = env.step(action)
#         elapsed_time = time.time() - start_time
#         step_times.append(elapsed_time)

#         start_time = time.time()
#         env.render()
#         elapsed_time = time.time() - start_time
#         render_times.append(elapsed_time)

#         if terminated or truncated:
#             break
#     env.close()
#     without_loopquest_step_time = sum(step_times) / len(step_times)
#     without_loopquest_render_time = sum(render_times) / len(render_times)
#     print(f"With Loopquest Average step time: {without_loopquest_step_time}")
#     print(f"Without Loopquest Average render time: {without_loopquest_render_time}")

#     print(
#         f"LoopQuest step overhead: {with_loopquest_step_time - without_loopquest_step_time}"
#     )
#     print(
#         f"LoopQuest render overhead: {with_loopquest_render_time - without_loopquest_render_time}"
#     )
#     assert True


if __name__ == "__main__":
    test_step_local()
    # test_step_cloud()
