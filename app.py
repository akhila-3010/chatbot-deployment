from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response
import nltk
import os

# ✅ Download required NLTK data for tokenization
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab')

# Set up NLTK data path (if needed)
nltk.data.path.append(os.path.join("venv", "nltk_data"))

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend access across domains

# Serve the main chat page
@app.route("/", methods=["GET"])
def index_get():
    return render_template("base.html")

# Handle messages from frontend
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        message = data.get("message")

        if not message:
            return jsonify({"answer": "Please type something, babe 😅"})

        # Get chatbot response
        response = get_response(message)
        return jsonify({"answer": response})

    except Exception as e:
        print("❌ Error in /predict:", e)
        return jsonify({"answer": "Internal server error, babe 😭"}), 500

# Run the app (Render will use Gunicorn automatically)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
