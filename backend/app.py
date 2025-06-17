from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
with open('LinearRegressionModel.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return jsonify({"message": "Car Price Prediction API is Running!"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Create input DataFrame
        input_df = pd.DataFrame([{
            'company': data.get('car_name'),
            'name': data.get('model'),
            'year': data.get('year'),
            'kms_driven': data.get('kms_driven'),
            'fuel_type': data.get('fuel_type')
        }])

        # Predict the price
        prediction = model.predict(input_df)[0]
        prediction = float(prediction)  # Ensure JSON serializable

        return jsonify({
            'predicted_price': round(prediction),
            'car_details': data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
