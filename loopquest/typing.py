import numpy as np
import torch

# TODO: support tf and jax in the future.
TensorType = np.ndarray | torch.Tensor
TensorStructType = TensorType | dict[str, TensorType]
