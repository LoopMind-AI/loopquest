from datasets import Dataset
from .crud import (
    get_steps_by_experiment,
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
        envs = {}
        for env_id in exp.environment_ids:
            envs[env_id] = get_environment(get_backend_url(), env_id)

        steps = get_steps_by_experiment(get_backend_url(), experiment_id)
        for step in steps:
            step_dict = step.model_dump()
            step_dict["observation"] = recover_from_space_val(step.observation)
            if step.action is not None:
                step_dict["action"] = recover_from_space_val(step.action)
            step_dict["env_metadata"] = envs[step.environment_id].metadata
            # step_dict["action_metadata"] = envs[step.environment_id].action_metadata
            # step_dict["observation_metadata"] = envs[
            #     step.environment_id
            # ].observation_metadata

            yield step_dict


def to_pilow(examples):
    image_ids_across_examples = examples["image_ids"]
    images = [
        [get_image_by_id(get_backend_url(), id) for id in image_ids]
        for image_ids in image_ids_across_examples
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
