from shortuuid import ShortUUID
from loopquest.schema import SpaceVal, NumpyLike

ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"
gen_short_uuid = lambda: ShortUUID(alphabet=ALPHABET).random(length=8)


def extract_value_from_space(result: dict, path: str):

    def extract_helper(space_val: SpaceVal, keys: list[str]):
        if len(keys) == 0:
            if space_val.value is not None:
                return space_val.value
            if space_val.seq is not None:
                return space_val.seq
            if space_val.dic is not None:
                return space_val.dic

        # key[0] is the current key to extract.
        if space_val.value is not None:
            # len(keys) > 0, meaning the value must be a NumpyLike object.
            if not isinstance(space_val.value, NumpyLike):
                raise ValueError("Value should be a NumpyLike object.")
            assert len(keys) == 1, "Path is invalid"
            return space_val.value.value[int(keys[0])]

        if space_val.seq is not None:
            # NOTE: if the space value is a sequence, the key will be passed to
            # the next level.
            return [extract_helper(sp, keys) for sp in space_val.seq]

        if space_val.dic is not None:
            return extract_helper(space_val.dic[keys[0]], keys[1:])

    if result is None:
        return None

    keys = path.split("/")
    space_val = SpaceVal(**result)
    # NOTE: since path always starts with "/" or is empty string "", the first
    # element in keys is always an empty string.
    return extract_helper(space_val, keys[1:])
