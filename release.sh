rm -r build dist loopmind.egg-info
python setup.py sdist bdist_wheel
# python -m build
twine upload dist/* -r loopmind