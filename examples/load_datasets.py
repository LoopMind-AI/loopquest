from loopquest.datasets import load_datasets

# ds = load_datasets(["244zv5pl", "3bdix3vi", "22fhjnd2"])
# ds = load_datasets(["n5tw5aor", "3rfqvz67"])
# from loopquest.datasets import load_datasets
ds = load_datasets(["120o6yi8", "3iygu67b"])

for i, r in enumerate(ds):
    print(r)
    if i > 5:
        break
