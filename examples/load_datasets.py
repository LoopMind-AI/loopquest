from loopquest.datasets import load_datasets
import loopquest

loopquest.init()
ds = load_datasets(["3o5jtpj1"])

for record in ds:
    print(record["metadata"])
    print(record["steps"][1])
    break
