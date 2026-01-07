import os
import tensorflow as tf
import numpy as np

MODEL_PATH = "oral_cancer_model.h5"

class ModelWrapper:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        """Loads the Keras model if available, else sets to None."""
        if os.path.exists(MODEL_PATH):
            print(f"Loading model from {MODEL_PATH}...")
            try:
                self.model = tf.keras.models.load_model(MODEL_PATH)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Warning: {MODEL_PATH} not found. Running in dummy mode.")
            self.model = None

    def predict(self, processed_image: np.ndarray):
        """
        Runs inference.
        Returns (label, confidence_score).
        """
        if self.model:
            # Assume model output is a single probability for binary classification
            # or softmax for multiclass. Adjust logic based on actual model.
            prediction = self.model.predict(processed_image)
            
            # Simple binary assumption: 0=Normal, 1=Cancer
            # Or if output is [prob_normal, prob_cancer]
            # Let's assume output is a single value p(Cancer)
            score = prediction[0][0] if prediction.shape[-1] == 1 else prediction[0][1]
            
            if score > 0.5:
                return "Cancer", float(score * 100)
            else:
                return "Normal", float((1 - score) * 100)
        else:
            # Dummy logic for demo if model is missing
            # Randomize slightly for effect, or deterministic based on image sum
            print("Using dummy prediction logic.")
            dummy_score = 92.45
            return "Cancer", dummy_score

model_wrapper = ModelWrapper()
