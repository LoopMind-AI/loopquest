from setuptools import setup

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="loopquest",
    version="0.1.11",
    description="A Production Tool for Embodied AI.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="LoopMind",
    author_email="contactus@loopmind.ai",
    url="https://github.com/LoopMind-AI/loopquest",
    packages=["loopquest"],
    install_requires=[
        "numpy>=1.25.1",
        "gymnasium~=0.29.0",
        "datasets>=2.14.4",
        "pydantic>=2.1.1",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "Pillow>=10.0.0",
        "pandas>=2.0.3",
        "pygame>=2.5.0",
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.11",
    ],
)
