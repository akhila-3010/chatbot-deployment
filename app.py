from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response
import nltk
import os

app = Flask(__name__)
CORS(app)  # Enables frontend (Render / JS) to call the backend

# ✅ Make sure NLTK data path exists (avoid lookup errors)
nltk_data_path = os.path.join(os.getcwd(), "nltk_data")
if os.path.exists(nltk_data_path):
    nltk.data.path.append(nltk_data_path)
else:
    print("⚠️ NLTK data folder not found, using default path.")

# ✅ Main route - serve the frontend page
@app.route("/", methods=["GET"])
def index():
    return render_template("base.html")

# ✅ Chatbot API endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        message = data.get("message")

        if not message or message.strip() == "":
            return jsonify({"answer": "Please type something, babe 😅"}), 400

        # Call your ML model / logic
        response = get_response(message)
        return jsonify({"answer": response})

    except Exception as e:
        print("🔥 Internal Server Error:", e)
        return jsonify({"answer": f"Oops! Server error: {str(e)}"}), 500

# ✅ For local debugging only — Render uses Gunicorn to start automatically
if __name__ == "__main__":
    # Make sure to match the Render port (environment variable `PORT`)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
