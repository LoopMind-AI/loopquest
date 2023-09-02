from datasets import Dataset
from .crud import get_steps_by_experiment, get_image_by_url
from .api import get_backend_url
from PIL import Image


def dataset_gen(experiment_ids: list[str]):
    for experiment_id in experiment_ids:
        # TODO: this can be further optimized by fetching a batch of steps at a
        # time. Maybe this is already considered by huggingface datasets?
        steps = get_steps_by_experiment(get_backend_url(), experiment_id)
        for step in steps:
            yield step


def to_pilow(examples):
    image_urls_across_examples = examples["image_urls"]
    images = [
        [get_image_by_url(url) for url in image_urls]
        for image_urls in image_urls_across_examples
    ]
    examples["images"] = images
    return examples


# TODO: add environment info to the dataset so the foundation model training can
# be conditioned on each of the environment.
def load_dataset(
    experiment_id: str, preload_images: bool = False, num_proc: int = 1
) -> Dataset:
    ds = Dataset.from_generator(lambda: dataset_gen([experiment_id]))
    if preload_images:
        # NOTE: this could be very slow.
        ds = ds.map(to_pilow, batched=True, num_proc=num_proc)
    else:
        ds.set_transform(to_pilow)
    return ds


def load_datasets(
    experiment_ids: list[str], preload_images: bool = False, num_proc: int = 1
) -> Dataset:
    ds = Dataset.from_generator(lambda: dataset_gen(experiment_ids))
    if preload_images:
        # NOTE: this could be very slow. Users could
        ds = ds.map(to_pilow, batched=True, num_proc=num_proc)
    else:
        ds.set_transform(to_pilow)
    return ds
