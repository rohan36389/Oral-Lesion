# Oral Cancer Prediction System

A complete end-to-end medical AI application for detecting oral cancer from images using Deep Learning. This system features a FastAPI backend for inference and a modern React frontend for user interaction.

## System Architecture

- **Backend**: FastAPI (Python)
    - Loads `oral_cancer_model.h5` (or uses dummy logic if missing).
    - Preprocesses images (resize to 224x224, normalization).
    - Exposes REST API `POST /predict`.
- **Frontend**: React + Vite
    - Modern UI with Tailwind CSS.
    - User-friendly image upload and result visualization.
    - Real-time confidence score display.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the server:

```bash
python main.py
```
The backend will start at `http://localhost:8000`.

> **Note**: Place your trained model file `oral_cancer_model.h5` in the `backend/` directory. If not present, the system runs in validation mode with mock predictions.

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

## usage

1. Open the frontend URL.
2. Click "Start Diagnosis" or navigate to `/predict`.
3. Upload an oral cavity image.
4. View the prediction result (Normal/Cancer) and confidence score.

## API Documentation

- **GET /**: Health check.
- **POST /predict**: Accepts `multipart/form-data` with `file` field. Returns JSON:
  ```json
  {
    "prediction": "Cancer",
    "confidence": 92.45
  }
  ```
