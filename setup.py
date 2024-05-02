from setuptools import setup, find_packages


with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="loopquest",
    version="0.2.1",
    description="A Production Tool for Embodied AI.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="LoopMind",
    author_email="contactus@loopmind.ai",
    url="https://github.com/LoopMind-AI/loopquest",
    packages=find_packages(),
    install_requires=[
        "gymnasium>=0.29.0",
        "huggingface-hub>=0.16.4",
        "datasets>=2.14.4",
        "python-dotenv>=1.0.0",
        "stable-baselines3>=2.2.1",
        "huggingface-sb3>=3.0",
        "pydantic>=2.1.1",
    ],
    extras_require={
        "dev": ["pytest", "twine"],
        "rl": ["ale_py>=0.8", "box2d-py==2.3.5", "pygame>=2.1.3", "swig==4.*"],
        "mujoco-py": ["mujoco-py>=2.1,<2.2", "cython<3"],
        "mujoco": ["mujoco>=2.1.5", "imageio>=2.14.1"],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
    ],
)
