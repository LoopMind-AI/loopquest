# :scroll:Loopquest

A Production Tool for Embodied AI.
![loopquest frontend](screenshots/loopquest-screenshot.png)

- :video_camera:[Tutorial Video](https://capture.dropbox.com/Nucp9ObLT63qDr2E), [Dataset Demo](https://capture.dropbox.com/AOF5rGxHWyRb9T58)
- :house:[Discord](https://discord.gg/FTnFYeSy9r)

# Major features

- Log all the observation, action, reward, rendered images into database with only ONE extra line of code.

```python
env = gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
```

->

```python
from loopquest.gym_wrappers import LoopquestGymWrapper
env = LoopquestGymWrapper(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array"), "my_experiment"
)
```

- Beautiful frontend to visualize all the data and rendered images / videos of the simulation environment.
- Compare your experiments in an intuitive way.
- Directly trainable data for robotics foundation model. Select and download the (observation, action, reward) data with the dataloader interfaces of the most popular deep learning frameworks (e.g. tensorflow, pytorch, huggingface dataset apis). Check [Dataset Quickstart Example](examples/Dataset%20Quickstart.ipynb) for more details.

```python
from loopquest.datasets import load_dataset, load_datasets
# Load data from a single experiment
ds = load_dataset("your_experiment_id")

# Load data from multiple experiments
ds = load_datasets(["exp1", "exp2"])
```

The data schema will look like

```python
{
    'id': '34yixvic-0-1',
    'creation_time': '2023-09-03T20:53:30.603',
    'update_time': '2023-09-03T20:53:30.965',
    'experiment_id': '34yixvic',
    'episode': 0,
    'step': 1,
    'observation': [-0.55, 0.00],
    'action': [0.14],
    'reward': -0.00,
    'prev_observation': [-0.55, 0.00],
    'termnated': False,
    'truncated': False,
    'done': False,
    'info': '{}',
    'sub_goal': None,
    'image_urls': ['http://localhost:5667/api/step/34yixvic-0-1/image/0'],
    'images': [<PIL.JpegImagePlugin.JpegImageFile image mode=RGB size=600x400 at 0x7F8D33094450>]
}
```

# Installation

For stable version, run

```
pip install loopquest
```

For dev version or loopquest project contributors, clone the git to your local machine by running

```
git clone https://github.com/LoopMind-AI/loopquest.git
```

Change to the project root folder and install the package

```
cd loopquest
pip install -e .
```

# How to run

At `loopquest` folder, bring up web-app,

```sh
docker compose up --build
```

Then run quickstart script,

```sh
python examples/quickstart.py
```

The command prompt should mention "Check your experiment progress on `http://localhost:5667/experiment/<exp_id>`".

**Loopquest Developer Only**: to bring up a development server that reflects your local changes in real time, run

```bash
bash start_dev_server.sh
```

# Quick Start Example

```python
import gymnasium
from loopquest.gym_wrappers import LoopquestGymWrapper

experiment_name = "test"
env = LoopquestGymWrapper(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array"),
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
```
