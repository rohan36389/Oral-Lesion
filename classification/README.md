# Oral Cancer Classification

This folder contains scripts to train a simple image classification model (ResNet18) to distinguish between `cancer` and `non-cancer` images.

## Prerequisites

- Python 3.x
- PyTorch
- Torchvision

## Data Structure

The scripts expect the following directory structure in the root of the workspace:

```
oral_segmentation/
├── OralCancer/
│   ├── cancer/
│   │   ├── image1.jpg
│   │   └── ...
│   └── non-cancer/
│       ├── image2.jpg
│       └── ...
├── classification/
│   ├── train.py
│   ├── predict.py
│   └── README.md
```

## How to Run

### 1. Train the Model

Run the training script from the terminal:

```bash
python classification/train.py
```

This will:
1. Load images from `OralCancer/`.
2. Train a ResNet18 model for 5 epochs.
3. Save the trained model to `classification/oral_cancer_model.pth`.

### 2. Predict on a New Image

Once the model is trained, you can predict the class of any image:

```bash
python classification/predict.py "path/to/your/image.jpg"
```

Example:
```bash
python classification/predict.py "OralCancer/cancer/some_image.jpg"
```
