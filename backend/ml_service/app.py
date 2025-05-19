from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model and encoders
model = joblib.load("model.pkl")
label_encoders = joblib.load("label_encoders.pkl")
target_encoder = joblib.load("target_encoder.pkl")

# List of categorical columns to encode
categorical_cols = ["Gender", "Employment Type", "Loan Type"]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Convert incoming JSON to DataFrame for processing
    input_df = pd.DataFrame([data])

    # Encode categorical columns using saved label encoders
    for col in categorical_cols:
        if col in input_df.columns:
            le = label_encoders[col]
            # Handle unseen labels by setting them to -1 or a default (optional)
            if input_df[col].iloc[0] not in le.classes_:
                return jsonify({"error": f"Unknown category '{input_df[col].iloc[0]}' in '{col}'"}), 400
            input_df[col] = le.transform(input_df[col])

    # Ensure columns match model training features order
    model_features = model.feature_names_in_
    input_df = input_df[model_features]

    # Make prediction and get probabilities
    prediction_num = model.predict(input_df)[0]
    confidence = np.max(model.predict_proba(input_df))

    # Decode prediction back to label
    prediction_label = target_encoder.inverse_transform([prediction_num])[0]

    return jsonify({
        "prediction": prediction_label,
        "confidence": float(confidence)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
