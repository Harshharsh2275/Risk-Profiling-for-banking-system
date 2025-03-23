import json
import re
import pandas as pd
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os
import base64
from flask_cors import CORS  # Import CORS

# Load environment variables
load_dotenv()

# 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

# Load the dataset
file_path = './synthetic_fraud_data.csv'
df = pd.read_csv(file_path)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Groq-based LLM
chat = ChatGroq(model_name="llama-3.3-70b-versatile", api_key="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")

def extract_risk_details(response_text):
    """Extracts risk_score and type from API response using regex."""
    score_match = re.search(r'"risk_score"\s*:\s*([\d.]+)', response_text)
    type_match = re.search(r'"type"\s*:\s*"([^"]+)"', response_text)

    if score_match and type_match:
        risk_score = float(score_match.group(1))  # Extract score as float
        risk_type = type_match.group(1)  # Extract category as string
        return {"risk_score": risk_score, "type": risk_type}
    
    print("Error: Could not extract valid data from response.")
    print("Received:", response_text)  # Debugging
    return {"risk_score": None, "type": "Error"}

def assess_risk(transaction_details):
    """Uses Groq API to analyze transaction risk and return extracted values."""
    prompt = f"""
    Analyze the following financial transaction and assess its risk level on a scale of 0 to 1.
    
    Transaction Details:
    {transaction_details}
    
    Response format: {{"risk_score": <score>, "type": "<classification>"}}
    """
    response = chat([
        SystemMessage(content="You are a financial risk assessment expert. Based on changes in sender and receiver locations, changes in MAC address, risk of money laundering, and transactions at odd hours, provide a risk score between 0 and 1. Classify transactions as follows: 'Legitimate' (0 to 0.4), 'Suspicious' (0.41 to 0.7), and 'High Risk' (0.71 to 1). Just return the JSON with risk score and classification."),
        HumanMessage(content=prompt)
    ])
    
    response_text = response.content.strip()  # Clean up response
    return extract_risk_details(response_text)  # Extract values using regex


#ocr
def extract_text_from_id(image_file):
    """Uses Groq API to perform OCR on an ID card and extract Name & DOB."""
    
    # Convert image to base64 string
    image_data = base64.b64encode(image_file.read()).decode('utf-8')

    prompt = f"""
    Perform OCR on the given image of a government ID card and extract the following details:
    - Full Name
    - Date of Birth (DOB)

    Response format: {{"name": "<full_name>", "dob": "<YYYY-MM-DD>"}}
    """

    response = chat([
        SystemMessage(content="You are an OCR expert specialized in extracting Name and Date of Birth from Indian government ID cards such as Aadhar and PAN. Return only the extracted JSON data."),
        HumanMessage(content=prompt, attachments=[{"type": "image", "data": image_data}])
    ])

    response_text = response.content.strip()  # Clean response
    return extract_json_details(response_text)  # Extract values using regex

def extract_json_details(response_text):
    """Extracts JSON details using regex (if needed)."""
    print(response_text)
    import json
    try:
        return json.loads(response_text)  # Parse response as JSON
    except json.JSONDecodeError:
        return {"error": "Invalid OCR response format"}

@app.route('/predict', methods=['POST'])
def analyze_transaction():
    """API endpoint to assess the risk of a given transaction."""
    data = request.get_json()  # Get JSON data from request body

    if not data:
        return jsonify({"error": "No transaction data provided"}), 400

    risk_result = assess_risk(data)  # Assess risk using the provided transaction

    return jsonify({
        "Transaction_ID": data.get('Transaction_ID', 'N/A'),
        "risk_score": risk_result.get('risk_score', 'N/A'),
        "category": risk_result.get('type', 'N/A')
    })

@app.route('/extract_id', methods=['POST'])
def extract_id_details():
    """API endpoint to extract name & DOB from ID card image."""
    
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']  # Get uploaded image
    extracted_data = extract_text_from_id(image_file)  # Process image

    return jsonify(extracted_data)

if __name__ == '__main__':
    app.run(debug=True)
