# :scroll:Loopquest

[![Downloads](https://static.pepy.tech/badge/loopquest)](https://pepy.tech/project/loopquest)
[![Downloads](https://static.pepy.tech/badge/loopquest/month)](https://pepy.tech/project/loopquest)
[![Downloads](https://static.pepy.tech/badge/loopquest/week)](https://pepy.tech/project/loopquest)

A Production Tool for Embodied AI.
![loopquest frontend](screenshots/loopquest-screenshot.png)

- :video_camera:[Tutorial Video - Updated 9/4/2023](https://capture.dropbox.com/UXKQxGkwel6VRZJQ), [Dataset Demo](https://capture.dropbox.com/AOF5rGxHWyRb9T58)
- :house:[Discord](https://discord.gg/FTnFYeSy9r)

# Major features

- Imitation Learning / Offline Reinforcement Learning Oriented MLOps. Log all the observation, action, reward, rendered images into database with only ONE extra line of code.

```python
env = gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
```

->

```python
import loopquest
env = loopquest.make_env(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
)
```

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

- All the regular MLOps features are included, e.g. data visualization, simulation rendering, experiment management.

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

# Usage

Run [quickstart script](examples/quickstart.py),

```sh
python examples/quickstart.py
```

The command prompt will ask you to select local or cloud instance. Pick the instance you want and once the script is up and running. You should see "Check your experiment progress on `http://localhost:5667/experiment/<exp_id>` or `https://open.loopquest.ai/experiment/<exp_id`" (depending on the instance you selected).

**Loopquest Developer Only**: to bring up a development server that reflects your local changes in real time, run

```bash
bash start_dev_server.sh
```

# Quick Start Example

```python
import gymnasium
import loopquest

env = loopquest.make_env(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
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
