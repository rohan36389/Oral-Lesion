import io
from PIL import Image
import numpy as np

def read_image_file(file_data: bytes) -> Image.Image:
    """Decodes bytes to PIL Image."""
    image = Image.open(io.BytesIO(file_data)).convert("RGB")
    return image

def preprocess_image(image: Image.Image, target_size=(224, 224)) -> np.ndarray:
    """
    Resizes and normalizes the image for the model.
    Returns a batch of size 1: (1, 224, 224, 3)
    """
    image = image.resize(target_size)
    img_array = np.array(image)
    # Normalize pixel values to [0, 1]
    img_array = img_array.astype("float32") / 255.0
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    return img_array
