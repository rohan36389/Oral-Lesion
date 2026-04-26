from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
from torchvision import models, transforms
from PIL import Image
import io
import torch.nn as nn
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Loading Logic ---
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(base_dir, "classification", "oral_cancer_model.pth")
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
class_names = ['cancer', 'non-cancer']

def load_model():
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")
    
    model = models.resnet18(weights=None)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(class_names))
    
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    return model

# Load model globally on startup
try:
    model = load_model()
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Transforms
data_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.get("/")
@app.get("/api/")
def read_root():
    return {"message": "Oral Cancer Classification API is running"}

@app.post("/predict")
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model not loaded"}

    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Preprocess
        image_tensor = data_transforms(image).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            predicted_class = class_names[preds[0]]
            confidence = probabilities[0][preds[0]].item()
            
        return {
            "prediction": predicted_class,
            "confidence": float(confidence),
            "probabilities": {
                class_names[0]: float(probabilities[0][0]),
                class_names[1]: float(probabilities[0][1])
            }
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
