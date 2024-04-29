from loopquest.datasets import load_datasets

ds = load_datasets(["z1dsuu4g"])

for record in ds:
    print(record)
