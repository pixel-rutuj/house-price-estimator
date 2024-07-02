import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from joblib import dump
import os

try:
    # Step 1: Load the Ames Housing Dataset from a local file
    data = pd.read_csv("C:/Users/Utkarsh/OneDrive/Desktop/RUTUJ/AmesHousing.csv")

    # Step 2: Clean and Preprocess the Data

    # Handle Missing Values

    # Separate numerical and categorical columns
    numerical_cols = data.select_dtypes(include=['int64', 'float64']).columns
    categorical_cols = data.select_dtypes(include=['object']).columns

    # Fill missing values in numerical columns with the median
    data[numerical_cols] = data[numerical_cols].fillna(data[numerical_cols].median())

    # Fill missing values in categorical columns with the mode
    data[categorical_cols] = data[categorical_cols].fillna(data[categorical_cols].mode().iloc[0])

    # Encode Categorical Variables using one-hot encoding
    data = pd.get_dummies(data)

    # Normalize/Standardize Numerical Features
    scaler = StandardScaler()
    data[numerical_cols] = scaler.fit_transform(data[numerical_cols])

    # Step 3: Split the Data

    # Feature Selection
    selected_features = ['Gr Liv Area', 'Overall Qual', 'Garage Cars', 'Year Built']
    
    # Ensure selected features are in the data
    features = [feature for feature in selected_features if feature in data.columns]
    
    if 'SalePrice' not in data.columns:
        raise ValueError("Target column 'SalePrice' not found in the dataset.")
        
    X = data[features]
    y = data['SalePrice']

    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Step 4: Train the Linear Regression Model

    # Initialize and train the model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    print(f"Mean Squared Error: {mse}")

    # Save the trained model
    model_path = 'house_price_model.joblib'
    dump(model, model_path)

    print("Model training and saving completed successfully.")
except FileNotFoundError:
    print("The specified file was not found.")
except Exception as e:
    print(f"An error occurred: {e}")
