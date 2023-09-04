from setuptools import setup


def parse_requirements(filename):
    """Load requirements from a pip requirements file."""
    with open(filename) as f:
        lineiter = (line.strip() for line in f)
        return [line for line in lineiter if line and not line.startswith("#")]


reqs = parse_requirements("requirements.txt")

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="loopquest",
    version="0.1.7",
    description="A Production Tool for Embodied AI.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="LoopMind",
    author_email="contactus@loopmind.ai",
    url="https://github.com/LoopMind-AI/loopquest",
    packages=["loopquest"],
    install_requires=reqs,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
    ],
)
