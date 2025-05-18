import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

# Load dataset
df = pd.read_csv("loanSphere.csv")

# Drop non-predictive or empty columns
df.drop(columns=["Borrower ID", "Loan ID", "Name", "Unnamed: 17"], inplace=True)

# Create synthetic labels based on sanction ratio
df["Sanction Ratio"] = df["Loan Amount Sanctioned"] / df["Loan Amount Requested"]

def synthetic_status(ratio):
    if ratio >= 0.98:
        return "approved"
    elif ratio <= 0.3:
        return "rejected"
    else:
        return "conditional"

df["Status"] = df["Sanction Ratio"].apply(synthetic_status)

# Drop columns not needed after labeling
df.drop(columns=["Sanction Ratio"], inplace=True)

# Encode categorical columns
label_encoders = {}
for col in ["Gender", "Employment Type", "Loan Type"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Encode target label
target_encoder = LabelEncoder()
df["Status"] = target_encoder.fit_transform(df["Status"])

# Features and target
X = df.drop(columns=["Status"])
y = df["Status"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# Save model and encoders
joblib.dump(model, "model.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")
joblib.dump(target_encoder, "target_encoder.pkl")
