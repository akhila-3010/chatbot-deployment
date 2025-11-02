from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response
import nltk
import os

# Set up NLTK data path (if needed)
nltk.data.path.append(os.path.join("venv", "nltk_data"))

app = Flask(__name__)
CORS(app)  # allow cross-origin requests (for frontend access)

# Serve main page
@app.route("/", methods=["GET"])
def index_get():
    return render_template("base.html")

# Handle messages from frontend
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"answer": "Please type something, babe 😅"})

    response = get_response(message)
    return jsonify({"answer": response})

# Only for local dev (Render uses Gunicorn)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
