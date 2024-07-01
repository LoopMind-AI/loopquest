from datasets import Dataset
from .crud import (
    get_steps_by_experiment_env_eps,
    get_max_eps_by_experiment_env,
    get_image_by_id,
    get_environment,
    get_experiment,
)
from .api import get_backend_url
from .env.space_utils import recover_from_space_val


def dataset_gen(experiment_ids: list[str]):
    for experiment_id in experiment_ids:
        # TODO: this can be further optimized by fetching a batch of steps at a
        # time. Maybe this is already considered by huggingface datasets?
        exp = get_experiment(get_backend_url(), experiment_id)
        for env_id in exp.environment_ids:
            env = get_environment(get_backend_url(), env_id)
            max_eps = get_max_eps_by_experiment_env(
                get_backend_url(), experiment_id, env_id
            )
            for eps in range(max_eps):
                steps = get_steps_by_experiment_env_eps(
                    get_backend_url(), experiment_id, env_id, eps
                )
                converted_steps = []
                for step in steps:
                    step_dict = step.model_dump()
                    step_dict["observation"] = recover_from_space_val(step.observation)
                    if step.action is not None:
                        step_dict["action"] = recover_from_space_val(step.action)
                    converted_steps.append(step_dict)

                yield {"metadata": env.metadata, "steps": converted_steps}


def to_pilow(examples):
    batch_steps = examples["steps"]
    for steps in batch_steps:
        for step in steps:
            image_ids = step["image_ids"]
            images = [
                get_image_by_id(get_backend_url(), image_id) for image_id in image_ids
            ]
            step["images"] = images
    return examples


def load_datasets(
    experiment_ids: list[str], preload_images: bool = False, num_proc: int = 1
) -> Dataset:
    ds = Dataset.from_generator(lambda: dataset_gen(experiment_ids))
    if preload_images:
        # NOTE: this could be very slow. Users could
        ds = ds.map(to_pilow, batched=True, num_proc=num_proc)
    return ds


def load_dataset(
    experiment_id: str, preload_images: bool = False, num_proc: int = 1
) -> Dataset:
    ds = load_datasets([experiment_id], preload_images, num_proc)
    return ds
