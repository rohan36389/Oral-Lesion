from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from preprocessing import read_image_file, preprocess_image
from model_loader import model_wrapper
import logging

app = FastAPI(title="Oral Cancer Prediction API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Oral Cancer Prediction Backend"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image file, runs preprocessing and inference, 
    and returns the prediction.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        # 1. Read Image
        image_bytes = await file.read()
        image = read_image_file(image_bytes)
        
        # 2. Preprocess
        processed_img = preprocess_image(image)
        
        # 3. Predict
        label, confidence = model_wrapper.predict(processed_img)
        
        # Calculate probabilities
        # Confidence is in percentage (0-100)
        prob_value = confidence / 100.0
        
        if label == "Cancer":
            cancer_prob = prob_value
            healthy_prob = 1.0 - prob_value
        else:
            healthy_prob = prob_value
            cancer_prob = 1.0 - prob_value

        return {
            "filename": file.filename,
            "prediction": label.lower(), # Frontend expects lowercase 'cancer' based on CSS classes
            "confidence": prob_value,   # Frontend seems to expect 0-1 for confidence based on (prediction.confidence * 100)
            "probabilities": {
                "cancer": cancer_prob,
                "non-cancer": healthy_prob
            }
        }

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
