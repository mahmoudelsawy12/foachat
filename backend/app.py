from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import bcrypt
import jwt
import datetime
import random
import string
import smtplib
import sqlite3
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
JWT_SECRET = os.getenv(
    "JWT_SECRET", "16f60d1f73509325d9476d3477ab63b93c6ce19738d3cc002acea57e56596173"
)
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY", "")


# Database setup
def get_db_connection():
    # Create users.db if it doesn't exist
    if not os.path.exists("users.db"):
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        cursor.execute(
            """
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
        """
        )
        conn.commit()
        conn.close()

    return sqlite3.connect("users.db")


# Chat database setup
def get_chat_db_connection():
    # Create chat.db if it doesn't exist
    if not os.path.exists("chat.db"):
        conn = sqlite3.connect("chat.db")
        cursor = conn.cursor()
        cursor.execute(
            """
        CREATE TABLE responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL
        )
        """
        )

        # Insert sample data for "what is ai?"
        cursor.execute(
            """
        INSERT INTO responses (question, answer) VALUES 
        (?, ?)
        """,
            (
                "what is ai?",
                "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. AI can be categorized as either weak AI or strong AI. Weak AI, also known as narrow AI, is designed to perform a narrow task (e.g. facial recognition). Strong AI, also known as artificial general intelligence, is AI that more fully replicates the autonomy of the human brain—AI that can solve many types of problems on its own, rather than focusing on one specific task.",
            ),
        )

        conn.commit()
        conn.close()

    return sqlite3.connect("chat.db")


# Reset codes storage
reset_codes = {}


def send_email(to_email, subject, html_content):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()

        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def generate_reset_code():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


# Function to get response from Gemini API
def get_gemini_response(prompt):
    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
        }
        params = {"key": GEMINI_API_KEY}
        data = {"contents": [{"parts": [{"text": prompt}]}]}

        response = requests.post(url, headers=headers, params=params, json=data)

        if response.status_code == 200:
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            print(f"Gemini API error: {response.status_code}, {response.text}")
            return None
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None


def find_best_matching_question(user_question, stored_questions):
    """Find the best matching question using fuzzy string matching."""
    # Clean and normalize the questions
    user_question = user_question.lower().strip().replace("?", "")

    # Process each stored question and find the best match
    matches = process.extractBests(
        user_question,
        [q.lower().strip().replace("?", "") for q in stored_questions],
        scorer=fuzz.token_sort_ratio,
        score_cutoff=70,  # Minimum similarity score (0-100)
    )

    if matches:
        best_match_index = stored_questions.index(
            next(
                q
                for q in stored_questions
                if q.lower().strip().replace("?", "") == matches[0][0]
            )
        )
        return best_match_index, matches[0][1]  # Return index and score

    return None, 0


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if user already exists
        cursor.execute(
            "SELECT * FROM users WHERE username = ? OR email = ?", (username, email)
        )
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"error": "Username or email already exists"}), 400

        # Create user
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password),
        )
        conn.commit()

        return jsonify({"message": "User created successfully"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Find user
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user or not bcrypt.checkpw(password.encode("utf-8"), user[3]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token
        token = jwt.encode(
            {
                "user_id": user[0],
                "username": user[1],
                "email": user[2],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
            },
            JWT_SECRET,
            algorithm="HS256",
        )

        return jsonify(
            {
                "token": token,
                "user": {"id": user[0], "username": user[1], "email": user[2]},
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/request-reset", methods=["POST"])
def request_reset():
    data = request.json
    email = data.get("email")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Find user
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Email not found"}), 404

        # Generate reset code
        reset_code = "".join(
            random.choices(
                string.ascii_lowercase
                + string.ascii_uppercase
                + string.digits
                + "#$%&",
                k=9,
            )
        )
        # Print reset code in terminal
        print(f"Generated Reset Code for {email}: {reset_code}")

        # Store reset code
        reset_codes[email] = reset_code

        # Send email with reset code
        reset_html = f"""
        <html>
            <body>
                <h1>Password Reset</h1>
                <p>Your password reset code is: <strong>{reset_code}</strong></p>
                <p>Enter this code on the reset password page to create a new password.</p>
            </body>
        </html>
        """

        send_email(email, "FOA CHAT AI - Password Reset", reset_html)

        return jsonify({"message": "Reset code sent to email"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email")
    reset_code = data.get("resetCode")
    new_password = data.get("newPassword")

    # Verify reset code
    if email not in reset_codes or reset_codes[email] != reset_code:
        return jsonify({"error": "Invalid reset code"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Find user
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update password
        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
        cursor.execute(
            "UPDATE users SET password = ? WHERE email = ?", (hashed_password, email)
        )
        conn.commit()

        # Clear reset code
        del reset_codes[email]

        return jsonify({"message": "Password reset successfully"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route("/api/chat/response", methods=["POST"])
def get_chat_response():
    data = request.json
    question = data.get("question", "").lower().strip()

    conn = get_chat_db_connection()
    cursor = conn.cursor()

    try:
        # Get all questions from database
        cursor.execute("SELECT question, answer FROM responses")
        stored_data = cursor.fetchall()

        if stored_data:
            stored_questions = [row[0] for row in stored_data]
            best_match_index, similarity_score = find_best_matching_question(
                question, stored_questions
            )

            if best_match_index is not None:
                # Return the answer for the best matching question
                return jsonify({"response": stored_data[best_match_index][1]})

        # If no match found or similarity score too low, use Gemini API
        if GEMINI_API_KEY:
            gemini_response = get_gemini_response(question)
            if gemini_response:
                # Store the new response in the database for future use
                cursor.execute(
                    "INSERT INTO responses (question, answer) VALUES (?, ?)",
                    (question, gemini_response),
                )
                conn.commit()
                return jsonify({"response": gemini_response})

        # Fallback response if Gemini API fails or is not configured
        return jsonify(
            {
                "response": "I don't have information about that yet. Please try asking something else."
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
