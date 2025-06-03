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
CORS(app, supports_credentials=True, origins=[
    "https://*.netlify.app",  # For Netlify deployments
    "http://localhost:5173", # For local frontend development
    "http://127.0.0.1:5173",  # Optional: For localhost with IP - Added comma here
    "https://*.tamagotchi.moekyun.me", # production
    "https://tamagotchi.moekyun.me"  # Added specific domain without wildcard
])

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

def cookie_check(session_cookie):
    """
    Validates the session cookie and retrieves the associated user.
    Returns the user object if valid, or a tuple with an error response and status code if invalid.
    """
    if not session_cookie:
        return jsonify({
            "status": "error",
            "message": "Authentication required."
        }), 401, None

    db = create_database_connection()
    try:
        user = db.fetchone(
            """
            SELECT users.id, users.email, users.display_name, users.avatar_url, users.timezone
            FROM cookies
            JOIN users ON cookies.user_id = users.id
            WHERE cookies.cookie_value = %s AND cookies.expires_at > NOW()
            """,
            (session_cookie,)
        )
        if not user:
            return jsonify({
                "status": "error",
                "message": "Invalid or expired session."
            }), 401, None
        return None, None, user  # No error, return the user object
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500, None
    finally:
        db.close()


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
        response.set_cookie("session", cookie_value, secure=True, httponly=True, samesite="None", expires=expires_at)

        return response, 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


@app.route("/api/profile", methods=["GET"])
def get_profile():
    """
    Retrieves the profile data for the authenticated user.
    Requires a valid session cookie.
    Returns user data, stats, and pet information.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        # Get user stats
        stats = db.fetchone(
            "SELECT current_streak, longest_streak, total_habits_completed "
            "FROM user_stats "
            "WHERE user_id = %s",
            (user["id"],)
        )

        # Get pet info
        pet = db.fetchone(
            "SELECT name, type, happiness, xp, health, lvl "
            "FROM pets "
            "WHERE user_id = %s",
            (user["id"],)
        )

        # Get user bio
        bio = db.fetchone(
            "SELECT bio FROM user_descriptions WHERE user_id = %s",
            (user["id"],)
        )

        # Build the response
        profile_data = {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "display_name": user["display_name"],
                "avatar_url": user["avatar_url"],
                "timezone": user["timezone"]
            },
            "stats": stats if stats else {
                "current_streak": 0,
                "longest_streak": 0,
                "total_habits_completed": 0
            },
            "pet": pet if pet else None,
            "bio": bio["bio"] if bio else None
        }

        return jsonify({
            "status": "ok",
            "data": profile_data
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/has-pet", methods=["GET"])
def has_pet():
    """
    Checks if the authenticated user has created a pet.
    Requires a valid session cookie.
    Returns a boolean indicating pet existence.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        pet = db.fetchone(
            "SELECT id FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        return jsonify({
            "status": "ok",
            "has_pet": pet is not None
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


@app.route("/api/create-pet", methods=["POST"])
def create_pet():
    """
    Creates a new pet for the authenticated user.
    Requires a valid session cookie.
    Expects a JSON payload with 'name' and 'type'.
    Returns the created pet data.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    # Validate input
    if not data or not all(key in data for key in ("name", "type")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'name' and 'type' are required."
        }), 400

    pet_name = data["name"]
    pet_type = data["type"]

    # Validate pet type
    valid_pet_types = ["cat", "duck", "bat", "dog"]
    if pet_type not in valid_pet_types:
        return jsonify({
            "status": "error",
            "message": f"Invalid pet type. Must be one of: {', '.join(valid_pet_types)}"
        }), 400

    db = create_database_connection()
    try:
        # Check if user already has a pet
        existing_pet = db.fetchone(
            "SELECT id FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        if existing_pet:
            return jsonify({
                "status": "error",
                "message": "User already has a pet."
            }), 400

        # Create the pet
        db.execute(
            "INSERT INTO pets (user_id, name, type) VALUES (%s, %s, %s) RETURNING id",
            (user["id"], pet_name, pet_type)
        )

        # Fetch the created pet
        pet = db.fetchone(
            "SELECT name, type, happiness, xp, health, lvl FROM pets WHERE user_id = %s",
            (user["id"],)
        )

        return jsonify({
            "status": "ok",
            "message": "Pet created successfully!",
            "data": pet
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


@app.route("/api/has-location", methods=["GET"])
def has_location():
    """
    Checks if the authenticated user has a geolocation entry in the database.
    Requires a valid session cookie.
    Returns a boolean indicating whether the location exists.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        # Check if the user has a geolocation entry
        location = db.fetchone(
            "SELECT user_id FROM user_geolocations WHERE user_id = %s",
            (user["id"],)
        )
        return jsonify({
            "status": "ok",
            "has_location": location is not None
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()


@app.route("/api/set-location", methods=["POST"])
def set_location():
    """
    Sets or updates the authenticated user's geolocation in the database.
    Requires a valid session cookie.
    Expects a JSON payload with 'latitude', 'longitude', and optionally 'accuracy'.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    # Validate input
    if not data or not all(key in data for key in ("latitude", "longitude")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'latitude' and 'longitude' are required."
        }), 400

    latitude = data["latitude"]
    longitude = data["longitude"]
    accuracy = data.get("accuracy", None)

    db = create_database_connection()
    try:
        # Insert or update the user's geolocation
        db.execute(
            """
            INSERT INTO user_geolocations (user_id, latitude, longitude, accuracy, updated_at)
            VALUES (%s, %s, %s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE
            SET latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                accuracy = EXCLUDED.accuracy,
                updated_at = NOW()
            """,
            (user["id"], latitude, longitude, accuracy)
        )

        return jsonify({
            "status": "ok",
            "message": "Location updated successfully."
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/set-bio", methods=["POST"])
def set_bio():
    """
    Sets or updates the authenticated user's bio.
    Requires a valid session cookie.
    Expects a JSON payload with 'bio'.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or "bio" not in data:
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'bio' is required."
        }), 400

    bio = data["bio"]

    db = create_database_connection()
    try:
        db.execute(
            """
            INSERT INTO user_descriptions (user_id, bio, updated_at)
            VALUES (%s, %s, NOW())
            ON CONFLICT (user_id) DO UPDATE
            SET bio = EXCLUDED.bio,
                updated_at = NOW()
            """,
            (user["id"], bio)
        )

        return jsonify({
            "status": "ok",
            "message": "Bio updated successfully."
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/weather", methods=["GET"])
def get_weather():
    """
    Retrieves the current weather based on the user's geolocation.
    Requires a valid session cookie and a geolocation entry in the database.
    """
    import requests
    def _get_weather_str_from_code(code: int):
        if code >= 0 and code <= 3:
            return "sunny"
        elif code == 45 or code == 48:
            return "cloudy"
        elif (code >= 51 and code <= 67) or (code >= 80 and code <= 82) or (code >= 95):
            return "rainy"
        elif code >= 71 and code <= 77:
            return "snowy"
        else:
            return "windy"

    def _get_weather_data_for_coordinate(longitude: int, latitude: int):
            url = f"https://api.open-meteo.com/v1/forecast?longitude={str(longitude)}&latitude={str(latitude)}&&current=weather_code"
            print(url)
            response = requests.get(url)
            if response.status_code == 200:
                response_data = response.json()
                print(response_data)
                return _get_weather_str_from_code(response_data["current"]["weather_code"])
            else:
                raise Exception(f"Failed to fetch weather data: {response.status_code}")

    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        location = db.fetchone(
            "SELECT latitude, longitude FROM user_geolocations WHERE user_id = %s",
            (user["id"],)
        )
        if not location:
            return jsonify({
                "status": "error",
                "message": "No geolocation data found for the user."
            }), 404

        latitude = location["latitude"]
        longitude = location["longitude"]
        try:
            weather = _get_weather_data_for_coordinate(longitude, latitude)
            return jsonify({
                "status": "ok",
                "weather": weather
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(debug=True)
