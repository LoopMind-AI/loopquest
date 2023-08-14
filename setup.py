from setuptools import setup, find_packages


def parse_requirements(filename):
    """Load requirements from a pip requirements file."""
    with open(filename) as f:
        lineiter = (line.strip() for line in f)
        return [line for line in lineiter if line and not line.startswith("#")]


reqs = parse_requirements("requirements.txt")


setup(
    name="loopquest",
    version="0.1.0",
    description="",
    author="LoopMind",
    author_email="contactus@loopmind.ai",
    url="",
    packages=["loopquest"],
    install_requires=reqs,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
    ],
)
