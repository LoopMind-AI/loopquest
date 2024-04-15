import gymnasium as gym
import numpy as np
from typing import Sequence
from ..schema import VarNode, NumpyLike, SpaceVal


def is_fundamental_gym_space(space: gym.Space):
    return (
        isinstance(space, gym.spaces.Box)
        or isinstance(space, gym.spaces.Discrete)
        or isinstance(space, gym.spaces.MultiBinary)
        or isinstance(space, gym.spaces.MultiDiscrete)
        or isinstance(space, gym.spaces.Text)
    )


def get_num_vars_in_fundamental_gym_space(space: gym.Space):
    """Get the number of variables in a fundamental gym space.
    Note that all the matrix-like spaces are flattened into a single vector.

    Args:
        space (gym.Space): The gym space object.

    Returns:
        int: The number of variables in the gym space.

    Raises:
        AssertionError: If the input space is not a fundamental gym space.
    """
    assert (
        isinstance(space, gym.spaces.Box)
        or isinstance(space, gym.spaces.Discrete)
        or isinstance(space, gym.spaces.MultiBinary)
        or isinstance(space, gym.spaces.MultiDiscrete)
        or isinstance(space, gym.spaces.Text)
    ), "Only fundamental gym spaces are supported."

    # Text is similar to scalar case. There is no children variables in this case.
    if isinstance(space, gym.spaces.Text):
        return 0

    # For the scalar case, space.shape = (), and sum(space.shape) = 0, and there
    # is no children variables in this case.
    return sum(space.shape)


def get_spec_for_ele_in_fundamental_gym_space(space: gym.Space):
    if not is_fundamental_gym_space(space):
        raise ValueError("Only fundamental gym spaces are supported.")

    if isinstance(space, gym.spaces.Box):
        return "Box"
    elif isinstance(space, gym.spaces.Discrete):
        return "Discrete"
    elif isinstance(space, gym.spaces.MultiBinary):
        return "Binary"
    elif isinstance(space, gym.spaces.MultiDiscrete):
        return "Discrete"
    elif isinstance(space, gym.spaces.Text):
        return "Text"
    else:
        raise ValueError("Unsupported gym space type.")


def create_var_tree(
    space: gym.Space, name: str = None, path="", tree_path=""
) -> VarNode:
    name = name if name is not None else "Root"
    root = VarNode(name=name, spec=repr(space), path=path, tree_path=tree_path)

    if is_fundamental_gym_space(space):
        for i in range(get_num_vars_in_fundamental_gym_space(space)):
            root.children.append(
                VarNode(
                    path=f"{path}/{i}",
                    tree_path=f"{tree_path}/{i}",
                    name=f"Var{i}",
                    spec=get_spec_for_ele_in_fundamental_gym_space(space),
                )
            )
    elif isinstance(space, gym.spaces.Dict):
        for i, (key, sub_space) in enumerate(space.items()):
            root.children.append(
                create_var_tree(
                    sub_space,
                    name=key,
                    path=f"{path}/{key}",
                    tree_path=f"{tree_path}/{i}",
                )
            )
    elif isinstance(space, gym.spaces.Tuple):
        for i, sub_space in enumerate(space.spaces):
            root.children.append(
                create_var_tree(
                    sub_space,
                    name=f"Subspace{i}",
                    path=f"{path}/{i}",
                    tree_path=f"{tree_path}/{i}",
                )
            )
    elif isinstance(space, gym.spaces.Sequence):
        root.children.append(
            create_var_tree(
                space.feature_space,
                name=f"FeatureSpace",
                path=path,
                tree_path=f"{tree_path}/0",
            )
        )
    elif isinstance(space, gym.spaces.Graph):
        root.children.append(
            create_var_tree(
                space.node_space,
                name=f"NodeSpace",
                path=f"{path}/nodes",
                tree_path=f"{tree_path}/0",
            )
        )
        root.children.append(
            create_var_tree(
                space.edge_space,
                name=f"EdgeSpace",
                path=f"{path}/edges",
                tree_path=f"{tree_path}/1",
            )
        )

    return root


def convert_np_array_to_np_like(arr: np.ndarray) -> NumpyLike:
    return NumpyLike(
        shape=list(arr.shape), value=arr.flatten().tolist(), type=str(arr.dtype)
    )


def convert_np_like_to_np_array(np_like: NumpyLike) -> np.ndarray:
    return np.array(np_like.value, dtype=np_like.type).reshape(np_like.shape)


def construct_space_val(
    space: gym.Space,
    val: np.ndarray | np.generic | str | dict | tuple | gym.spaces.GraphInstance,
) -> SpaceVal:
    # NOTE: sometimes the observation from the environment could cross the
    # boundary by a tiny epsilon, and failed this contains check. Hence disabled.
    # assert space.contains(val), f"Value {val} is not in the space {space}."

    # NOTE: Still need to cast the value to the corresponding type since the
    # value could come from neural networks, whose output might not be the same
    # type as what we expect.
    if isinstance(
        space, (gym.spaces.Box, gym.spaces.MultiBinary, gym.spaces.MultiDiscrete)
    ):
        if isinstance(val, Sequence):
            val = np.array(val)
        val = np.asarray(val)
        assert isinstance(
            val, np.ndarray
        ), f"Value should be able to cast to a numpy array for space {space}."
        # NOTE: if val is a scalar numpy array with shape = (), we will not
        # create a NumpyLike object for it, and this will be consistent with the
        # metadata variable tree structure.
        if sum(val.shape) == 0:
            return SpaceVal(spec=repr(space), value=val.item())
        return SpaceVal(spec=repr(space), value=convert_np_array_to_np_like(val))

    if isinstance(space, gym.spaces.Discrete):
        if isinstance(val, int) or (
            isinstance(val, (np.generic, np.ndarray))
            and (np.issubdtype(val.dtype, np.integer) and val.shape == ())
        ):
            as_int64 = np.int64(val)
        else:
            raise ValueError(
                f"Value should be an integer or a numpy integer for space {space}."
            )
        return SpaceVal(spec=repr(space), value=as_int64.item())

    if isinstance(space, gym.spaces.Text):
        assert isinstance(val, str), f"Value should be a str for space {space}."
        return SpaceVal(spec=repr(space), value=val)

    if isinstance(space, gym.spaces.Dict):
        assert isinstance(val, dict), f"Value should be a dict for space {space}."
        dict_val = {}
        for k, spc in space.items():
            dict_val[k] = construct_space_val(spc, val[k])
        return SpaceVal(spec=repr(space), dic=dict_val)

    if isinstance(space, gym.spaces.Tuple):
        if isinstance(val, (list, np.ndarray)):
            val = tuple(val)  # Promote list and ndarray to tuple for contains check
        assert isinstance(val, tuple), f"Value should be a tuple for space {space}."
        dict_val = {
            str(i): construct_space_val(spc, val[i])
            for i, spc in enumerate(space.spaces)
        }
        return SpaceVal(spec=repr(space), dic=dict_val)

    if isinstance(space, gym.spaces.Sequence):
        assert isinstance(val, Sequence)
        dict_val = [construct_space_val(space.feature_space, v) for v in val]
        return SpaceVal(spec=repr(space), seq=dict_val)

    if isinstance(space, gym.spaces.Graph):
        assert isinstance(val, gym.spaces.GraphInstance)
        dict_val = {
            "nodes": SpaceVal(value=convert_np_array_to_np_like(val.nodes)),
        }
        if val.edges is not None:
            dict_val["edges"] = SpaceVal(value=convert_np_array_to_np_like(val.edges))

        if val.edge_links is not None:
            dict_val["edge_links"] = SpaceVal(
                value=convert_np_array_to_np_like(val.edge_links)
            )
        return SpaceVal(spec=repr(space), dic=dict_val)

    raise ValueError("Unsupported gym space type.")


def recover_from_space_val(space_val: SpaceVal):
    if space_val.value is not None:
        if isinstance(space_val.value, NumpyLike):
            return convert_np_like_to_np_array(space_val.value)
        return space_val.value

    if space_val.seq is not None:
        return tuple([recover_from_space_val(sp) for sp in space_val.seq])

    if space_val.dic is not None:
        if space_val.spec.startswith("Dict"):
            return {k: recover_from_space_val(sp) for k, sp in space_val.dic.items()}
        else:
            # Graph space
            return gym.spaces.GraphInstance(
                nodes=convert_np_like_to_np_array(space_val.dic["nodes"].value),
                edges=(
                    convert_np_like_to_np_array(space_val.dic["edges"].value)
                    if "edges" in space_val.dic
                    else None
                ),
                edge_links=(
                    convert_np_like_to_np_array(space_val.dic["edge_links"].value)
                    if "edge_links" in space_val.dic
                    else None
                ),
            )

    raise ValueError("Unsupported SpaceVal type.")
