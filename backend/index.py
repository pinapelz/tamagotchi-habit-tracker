from flask import Flask, jsonify, request
from flask_cors import CORS
from .database import PostgresHandler
from dotenv import load_dotenv

from datetime import datetime, timedelta
import uuid



import os
import sys

sys.path.append(os.path.dirname(__file__))
load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True)

def create_database_connection():
    """
    Creates an authenticated database connection (Postgres)
    """
    return PostgresHandler(
        host=os.environ.get("PG_HOST"),
        user=os.environ.get("PG_USER"),
        password=os.environ.get("PG_PASSWORD"),
        database=os.environ.get("PG_DATABASE"),
        port=5432
    )


@app.route("/api/info")
def check_db():
    """
    Checks the database connection by executing a simple query.
    Attempts to connect to the database and execute a basic "SELECT 1" query to verify connectivity.
    Returns a JSON response indicating the status of the connection, a message, and the current commit SHA.
        tuple: A tuple containing a JSON response and an HTTP status code.
            - On success: status "ok", message, and commit SHA with HTTP 200.
            - On failure: status "error", error message, and commit SHA with HTTP 500.
    """
    db = create_database_connection()
    try:
        db.execute("SELECT 1")
        commit_sha = os.getenv("VERCEL_GIT_COMMIT_SHA", "unknown/local_dev")

        return jsonify({
            "status": "ok",
            "message": "Database connection successful",
            "commit": commit_sha
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "commit": os.getenv("VERCEL_GIT_COMMIT_SHA", "unknown/local_dev")
        }), 500
    finally:
        db.close()


@app.route("/api/register", methods=["POST"])
def register_user():
    """
    Registers a new user by storing their information in the database.
    Expects a JSON payload with 'username', 'email', and 'password'.
    Returns a success message or an error message.
    """
    from werkzeug.security import generate_password_hash
    data = request.get_json()

    # Validate input
    if not data or not all(key in data for key in ("username", "email", "password")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'username', 'email', and 'password' are required."
        }), 400

    username = data["username"]
    email = data["email"]
    password = data["password"]

    # Hash the password
    hashed_password = generate_password_hash(password)

    db = create_database_connection()
    try:
        # Insert user into the users table
        db.execute(
            "INSERT INTO users (email, display_name) VALUES (%s, %s) RETURNING id",
            (email, username)
        )
        # Fetch the generated user ID
        user_id = db.fetchone("SELECT id FROM users WHERE email = %s", (email,))["id"]

        # Insert the hashed password into the user_passwords table
        db.execute(
            "INSERT INTO user_passwords (user_id, password_hash, salt) VALUES (%s, %s, %s)",
            (user_id, hashed_password, "default_salt") 
        )

        return jsonify({
            "status": "ok",
            "message": "User registered successfully."
        }), 201
    except Exception as e:
        # Handle specific database errors (e.g., unique constraint violations)
        if "unique constraint" in str(e).lower():
            return jsonify({
                "status": "error",
                "message": "A user with this email already exists."
            }), 400
        # Generic error response
        return jsonify({

            "status": "error",
            "message": str(e)
        }), 500

    finally:
        db.close()


@app.route("/api/authenticate", methods=["POST"])
def authenticate_user():
    """
    Authenticates a user by verifying their email and password.
    Generates a session cookie upon successful authentication.
    """
    from werkzeug.security import check_password_hash
    data = request.get_json()
    # Validate input
    if not data or not all(key in data for key in ("email", "password")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'email' and 'password' are required."
        }), 400

    email = data["email"]
    password = data["password"]

    db = create_database_connection()
    try:
        # Fetch user and password hash
        user = db.fetchone("SELECT id FROM users WHERE email = %s", (email,))
        if not user:
            return jsonify({
                "status": "error",
                "message": "Invalid email or password."
            }), 401
        user_id = user["id"]
        password_data = db.fetchone("SELECT password_hash FROM user_passwords WHERE user_id = %s", (user_id,))
        if not password_data or not check_password_hash(password_data["password_hash"], password):
            return jsonify({
                "status": "error",
                "message": "Invalid email or password."
            }), 401
        # Generate a session cookie
        cookie_value = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)  # Cookie valid for 7 days
        # Insert the cookie into the database
        db.execute(
            "INSERT INTO cookies (user_id, cookie_value, expires_at) VALUES (%s, %s, %s)",
            (user_id, cookie_value, expires_at)
        )
        # Return the session cookie
        response = jsonify({
            "status": "ok",
            "message": "Authentication successful."
        })
        response.set_cookie("session", cookie_value, httponly=True, samesite="Strict", expires=expires_at)

        return response, 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


@app.route("/api/auto-login", methods=["GET"])
def auto_login():
    """
    Automatically logs in a user if a valid session cookie is present.
    """
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        return jsonify({
            "status": "error",
            "message": "No session cookie found."
        }), 401

    db = create_database_connection()
    try:
        # Validate the session cookie
        user = db.fetchone(
            "SELECT users.id, users.email, users.display_name FROM cookies "
            "JOIN users ON cookies.user_id = users.id "
            "WHERE cookies.cookie_value = %s AND cookies.expires_at > NOW()",
            (session_cookie,)
        )
        if not user:
            return jsonify({
                "status": "error",
                "message": "Invalid or expired session."
            }), 401

        # Return user information
        return jsonify({
            "status": "ok",
            "message": "Auto-login successful.",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "display_name": user["display_name"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


if __name__ == "__main__":
    app.run(debug=True)
