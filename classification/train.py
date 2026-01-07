import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split
import os
import time

def train_model():
    # 1. Setup Paths
    # The user's data is in "OralCancer" in the workspace root.
    # We go up one level from 'classification' folder to root, then into 'OralCancer'
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "OralCancer")
    
    print(f"Looking for data in: {data_dir}")

    if not os.path.exists(data_dir):
        print(f"Error: Directory {data_dir} not found.")
        return

    # 2. Define Transforms
    # ResNet expects 224x224 images
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # 3. Load Data using ImageFolder
    # ImageFolder expects structure: root/class_x/xxx.png
    try:
        full_dataset = datasets.ImageFolder(data_dir, transform=data_transforms)
    except Exception as e:
        print(f"Error loading dataset: {e}")
        print(f"Make sure '{data_dir}' contains subfolders for each class (e.g., 'cancer', 'non-cancer').")
        return

    class_names = full_dataset.classes
    print(f"Classes found: {class_names}")
    print(f"Total images: {len(full_dataset)}")
    
    if len(full_dataset) == 0:
        print("No images found. Check your directory structure.")
        return

    # Split into Train (80%) and Val (20%)
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    # num_workers=0 is safer on Windows to avoid multiprocessing errors
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=0)

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 4. Setup Model (ResNet18)
    print("Loading ResNet18 model...")
    # Using 'DEFAULT' weights (ImageNet)
    model = models.resnet18(weights='DEFAULT')
    num_ftrs = model.fc.in_features
    
    # Change the final layer to output number of classes (2 for cancer/non-cancer)
    model.fc = nn.Linear(num_ftrs, len(class_names))
    
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

    # 5. Training Loop
    num_epochs = 5
    print(f"Starting training for {num_epochs} epochs...")

    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
                dataloader = train_loader
            else:
                model.eval()
                dataloader = val_loader

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloader:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloader.dataset)
            epoch_acc = running_corrects.double() / len(dataloader.dataset)

            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    print('Training complete')
    
    # 6. Save Model
    save_path = os.path.join(base_dir, "classification", "oral_cancer_model.pth")
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")

if __name__ == '__main__':
    train_model()
