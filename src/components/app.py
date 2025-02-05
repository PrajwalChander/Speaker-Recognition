from flask import Flask, request, jsonify
import joblib
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
app = Flask(__name__)
CORS(app)
# Load the trained SVM model and label encoder
voting_model = joblib.load("voting_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Extract features from the request body
        data = request.json

        # Convert features to the format required by the model
        feature_vector = (
            data["mfcc"] +
            data["chroma"] +
            [
                data["energy"],
                data["zeroCrossingRate"],
                data["spectralCentroid"],
                data["spectralFlatness"],
                data["spectralSkewness"],
                data["spectralKurtosis"],
                data["spectralSlope"],
                data["spectralSpread"],
                data["spectralRolloff"],
            ]
        )

        # Reshape for prediction
        feature_vector = [feature_vector]
        input_features = scaler.transform(feature_vector)
        print(input_features)
        # Predict the username
        prediction = voting_model.predict(input_features)
        predicted_username = label_encoder.inverse_transform(prediction)[0]

        return jsonify({"predictedUsername": "Hi "+predicted_username})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
