from datasets import Dataset
from .crud import get_steps_by_experiment, get_image_by_url
from .api import get_backend_url
from PIL import Image


def dataset_gen(experiment_ids: list[str], fetch_images: bool = False):
    for experiment_id in experiment_ids:
        # TODO: this can be further optimized by fetching a batch of steps at a time.
        steps = get_steps_by_experiment(get_backend_url(), experiment_id)
        for step in steps:
            if fetch_images:
                step["images"] = [
                    get_image_by_url(image_url) for image_url in step["image_urls"]
                ]
            yield step


def load_dataset(experiment_id: str, fetch_images: bool = False) -> Dataset:
    return Dataset.from_generator(
        lambda: dataset_gen([experiment_id], fetch_images=fetch_images)
    )


def load_datasets(experiment_ids: list[str], fetch_images: bool = False) -> Dataset:
    return Dataset.from_generator(
        lambda: dataset_gen(experiment_ids, fetch_images=fetch_images)
    )
