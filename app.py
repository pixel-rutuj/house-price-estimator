from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from joblib import load
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS

# Replace with your actual MySQL database credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Utkarsh2819@localhost/house_prices'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class House(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gr_liv_area = db.Column(db.Integer, nullable=False)
    overall_qual = db.Column(db.Integer, nullable=False)
    garage_cars = db.Column(db.Integer, nullable=False)
    year_built = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

model = load("C:/Users/Utkarsh/OneDrive/Desktop/RUTUJ/house_price_model.joblib")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = [
            int(data['gr_liv_area']),
            int(data['overall_qual']),
            int(data['garage_cars']),
            int(data['year_built'])
        ]
        prediction = model.predict([features])[0]

        # Save the input data and predicted price to the database
        new_house = House(
            gr_liv_area=features[0],
            overall_qual=features[1],
            garage_cars=features[2],
            year_built=features[3],
            price=prediction
        )
        db.session.add(new_house)
        db.session.commit()

        return jsonify({'predicted_price': prediction})
    except Exception as e:
        logging.exception("Prediction error")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    with app.app_context():
        db.create_all()
    app.run(debug=True)
