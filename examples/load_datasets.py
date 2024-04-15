from loopquest.datasets import load_datasets

ds = load_datasets(["6engest7"])

for record in ds:
    print(record)
