from loopquest.datasets import load_datasets
import loopquest

loopquest.init()
ds = load_datasets(["2jfmu4u9"])

for record in ds:
    print(record)
