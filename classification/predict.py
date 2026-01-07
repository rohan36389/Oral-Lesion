import torch
from torchvision import models, transforms
from PIL import Image
import os
import sys
import torch.nn as nn

def predict_image(image_path):
    # 1. Setup Paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, "classification", "oral_cancer_model.pth")
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Please run train.py first.")
        return

    # 2. Define Transforms (Must match training)
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # 3. Load Model
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    
    # We need to know the classes. 
    # Ideally we save this with the model, but for now we assume alphabetical order of folders
    # If you have 'cancer' and 'non-cancer', classes are ['cancer', 'non-cancer']
    class_names = ['cancer', 'non-cancer'] 
    
    model = models.resnet18(weights=None) # No need to download weights, we load ours
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(class_names))
    
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()

    # 4. Load and Preprocess Image
    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        return

    try:
        image = Image.open(image_path).convert('RGB')
        image_tensor = data_transforms(image).unsqueeze(0) # Add batch dimension
        image_tensor = image_tensor.to(device)

        # 5. Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            predicted_class = class_names[preds[0]]
            confidence = probabilities[0][preds[0]].item()

            print(f"Prediction: {predicted_class}")
            print(f"Confidence: {confidence:.2%}")
            
            return predicted_class, confidence

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_image>")
    else:
        predict_image(sys.argv[1])
