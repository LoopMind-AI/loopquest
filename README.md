# :scroll:Loopquest

A Production Tool for Embodied AI.
![loopquest frontend](https://uc6becc3d1d5a2bb4384c799f976.previews.dropboxusercontent.com/p/thumb/AB_9SrHiikANblnwQn2HD86liqTa40fT3A5AQXtWW8mataHM8WQDxj33spLoAmGeD9fF7QuQB7P9U23Hbh5hOX9Z6HCDR6VgwAMwLhlDJVbPk1xyn3B3JGY89iWLidSvFi6bj8BGfQddddRQn5rSgjIzZDz64BTvze23h2jkyUJaaeaM6YkTjNNu0yKSZu4h9I_jWy39V9GHzL5-EebqO8IPekLHpI-HzolWZZwCakGSOpVbyYINtEJjd405lr-jh9NFIY3vV4RzCmyzT7EusePnJ-ITU8SuCbM7uiA00798WPqlJEQfYpm6N9MlsxuE8DsMw1bjKcc0IaRU-FrMl4akrXOneyiPXqCvw6oKsctX9A/p.png)

- :video_camera:[Tutorial Video](https://capture.dropbox.com/Nucp9ObLT63qDr2E)
- :house:[Discord](https://discord.gg/FTnFYeSy9r)

# Major features

- Log all the observation, action, reward, rendered images into database with only ONE extra line of code.

```python
env = gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
```

->

```python
env = LoopquestGymWrapper(
    gymnasium.make("MountainCarContinuous-v0", render_mode="rgb_array")
)
```

- Beautiful frontend to visualize all the data and rendered images / videos of the simulation environment.
- (Coming Soon) Compare your experiments in an intuitive way.
- (Coming Soon) Directly trainable data for robotics foundation model. Select and download the (observation, action, reward) data with the dataloader interfaces of the most popular deep learning frameworks (e.g. tensorflow, pytorch, huggingface dataset apis).

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

# How to run (dev only for now)

At `loopquest` folder, bring up the backend server and database,

```
docker compose up --build
```

Bring up the frontend web app,

```
cd frontend
npm run dev
```

Then run quickstart script,

```
python examples/quickstart.py
```

The command prompt should mention "Check your experiment progress on `http://localhost:3000/experiment/<exp_id>`".

# Quick Start Example

```python
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
```
