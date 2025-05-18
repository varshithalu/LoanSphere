from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load trained model and encoders
model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
label_encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "target_encoder.pkl"))

# Define the feature columns expected
FEATURE_COLUMNS = [
    "Age", "Gender", "Employment Type", "Annual Income",
    "Loan Amount Requested", "Loan Tenure (Months)",
    "Previous Loans Taken", "Previous Loan Defaults",
    "Existing Loan Amounts", "Debt-to-Income Ratio",
    "Monthly EMI","Missed EMI Payments", "Late Payment Charges",
    "Loan Type"                 
]


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Ensure all expected fields are present
        missing = [col for col in FEATURE_COLUMNS if col not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Create DataFrame from input
        input_df = pd.DataFrame([data])

        # Apply label encoding to categorical columns
        for col in ["Gender", "Employment Type", "Loan Type"]:
            le = label_encoders[col]
            input_df[col] = le.transform([data[col]])

        # Predict using the model
        prediction = model.predict(input_df)[0]
        status = target_encoder.inverse_transform([prediction])[0]

        return jsonify({"result": status})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
