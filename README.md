# loopquest

A Production Tool for Embodied AI

# Installation (Dev, temporary)

At the root folder

```
pip install -e .
```

# How to run (Dev, temporary)

Bring up the backend server and database, at the root folder run

```
docker compose up --build
```

Bring up the frontend web app,

```
cd frontend
npm run dev
```

Test if everything works,

```
pytest tests
```

The command prompt should mention check your experiment results on

```
http://localhost:3000/experiment/<exp_id>
```
