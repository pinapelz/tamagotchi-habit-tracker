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

        # Create notification for new pet
        create_notification(
            db,
            user["id"],
            "pet",
            f"Welcome {pet_name} the {pet_type}! Your new pet has joined your journey! 🐾"
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

@app.route("/api/habits", methods=["GET"])
def get_habits():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        habits = db.fetchall(
            "SELECT id, name, recurrence_type AS recurrence, created_at, last_completed_at FROM habits WHERE user_id = %s",
            (user["id"],)
        )

        # Optionally mark completion based on whether `last_completed_at` is today
        today = datetime.utcnow().date()
        for h in habits:
            h["completed"] = h["last_completed_at"].date() == today if h["last_completed_at"] else False

        return jsonify(habits), 200
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
    finally:
        db.close()


@app.route("/api/habits", methods=["POST"])
def create_habit():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    name = data.get("name")
    recurrence = data.get("recurrence")

    if not name or not recurrence:
        return jsonify({ "status": "error", "message": "Missing name or recurrence" }), 400

    db = create_database_connection()
    try:
        db.execute(
            "INSERT INTO habits (user_id, name, recurrence_type) VALUES (%s, %s, %s)",
            (user["id"], name, recurrence)
        )
        return jsonify({ "status": "ok", "message": "Habit created" }), 201
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
    finally:
        db.close()


def create_notification(db, user_id, type, message):
    """
    Creates a notification for a user.
    """
    try:
        print(f"Creating notification: user_id={user_id}, type={type}, message={message}")
        db.execute(
            """
            INSERT INTO notifications (user_id, type, message)
            VALUES (%s, %s, %s)
            """,
            (user_id, type, message)
        )
        print("Notification created successfully")
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        raise e  # Re-raise the exception so it can be handled by the caller

@app.route("/api/habits/<uuid:habit_id>/complete", methods=["POST"])
def complete_habit(habit_id):
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        # Get habit name before updating
        habit = db.fetchone(
            "SELECT name FROM habits WHERE id = %s AND user_id = %s",
            (str(habit_id), user["id"])
        )
        if not habit:
            return jsonify({ "status": "error", "message": "Habit not found" }), 404

        # Update habit completion
        db.execute(
            "UPDATE habits SET last_completed_at = NOW() WHERE id = %s AND user_id = %s",
            (str(habit_id), user["id"])
        )

        # Get current pet stats
        pet = db.fetchone(
            "SELECT name, type, happiness, xp, health, lvl FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        if pet:
            # Calculate new stats
            new_happiness = min(100, pet["happiness"] + 5)  # Increase happiness by 5, max 100
            new_health = min(100, pet["health"] + 2)  # Increase health by 2, max 100
            new_xp = pet["xp"] + 10  # Increase XP by 10

            # Check for level up
            if new_xp >= 100:
                new_xp = new_xp % 100  # Reset XP to remainder
                new_level = pet["lvl"] + 1
                # Create level up notification
                create_notification(
                    db,
                    user["id"],
                    "pet",
                    f"🎉 {pet['name']} has reached level {new_level}! Your pet is growing stronger! 🐾"
                )
            else:
                new_level = pet["lvl"]

            # Update pet stats
            db.execute(
                "UPDATE pets SET happiness = %s, health = %s, xp = %s, lvl = %s WHERE user_id = %s",
                (new_happiness, new_health, new_xp, new_level, user["id"])
            )

        # Create habit completion notification
        create_notification(
            db,
            user["id"],
            "habit",
            f"You completed your habit: {habit['name']}!"
        )

        return jsonify({ "status": "ok", "message": "Habit marked complete" }), 200
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
    finally:
        db.close()


@app.route("/api/habits/<uuid:habit_id>", methods=["DELETE"])
def delete_habit(habit_id):
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        db.execute("DELETE FROM habits WHERE id = %s AND user_id = %s", (str(habit_id), user["id"]))
        return jsonify({ "status": "ok", "message": "Habit deleted" }), 200
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
    finally:
        db.close()

@app.route("/api/habits/<uuid:habit_id>", methods=["PUT"])
def update_habit(habit_id):
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    new_name = data.get("name")
    new_recurrence = data.get("recurrence")

    if not new_name:
        return jsonify({ "status": "error", "message": "Missing habit name" }), 400

    db = create_database_connection()
    try:
        db.execute(
            "UPDATE habits SET name = %s, recurrence_type = %s WHERE id = %s AND user_id = %s",
            (new_name, new_recurrence, str(habit_id), user["id"])
        )
        return jsonify({ "status": "ok", "message": "Habit updated" }), 200
    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
    finally:
        db.close()

@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        notifications = db.fetchall(
            """
            SELECT id, type, message, read, created_at
            FROM notifications
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user["id"],)
        )
        return jsonify({
            "status": "ok",
            "notifications": notifications
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/notifications/<uuid:notification_id>/read", methods=["PUT"])
def mark_notification_read(notification_id):
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code
    
    db = create_database_connection()
    try:
        # Convert UUID to string for database query
        notification_id_str = str(notification_id)
        user_id_str = str(user["id"])
        
        db.execute(
            """
            UPDATE notifications
            SET read = TRUE
            WHERE id = %s AND user_id = %s
            """,
            (notification_id_str, user_id_str)
        )
        return jsonify({
            "status": "ok",
            "message": "Notification marked as read"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/notifications/<uuid:notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code
    
    db = create_database_connection()
    try:
        # Convert UUID to string for database query
        notification_id_str = str(notification_id)
        user_id_str = str(user["id"])
        
        db.execute(
            """
            DELETE FROM notifications
            WHERE id = %s AND user_id = %s
            """,
            (notification_id_str, user_id_str)
        )
        return jsonify({
            "status": "ok",
            "message": "Notification deleted"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/notifications/unread-count", methods=["GET"])
def get_unread_notification_count():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code
    
    db = create_database_connection()
    try:
        count = db.fetchone(
            """
            SELECT COUNT(*) as count
            FROM notifications
            WHERE user_id = %s AND read = FALSE
            """,
            (user["id"],)
        )
        return jsonify({
            "status": "ok",
            "count": count["count"]
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/friends/request", methods=["POST"])
def send_friend_request():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or "friend_id" not in data:
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'friend_id' is required."
        }), 400

    friend_id = data["friend_id"]
    db = create_database_connection()
    try:
        # Get friend's display name
        friend = db.fetchone(
            "SELECT display_name FROM users WHERE id = %s",
            (friend_id,)
        )
        if not friend:
            return jsonify({
                "status": "error",
                "message": "User not found."
            }), 404

        # Create notification for friend
        create_notification(
            db,
            friend_id,
            "friend",
            f"{user['display_name']} sent you a friend request!"
        )

        return jsonify({
            "status": "ok",
            "message": "Friend request sent successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/friends/accept", methods=["POST"])
def accept_friend_request():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or "friend_id" not in data:
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'friend_id' is required."
        }), 400

    friend_id = data["friend_id"]
    db = create_database_connection()
    try:
        # Get friend's display name
        friend = db.fetchone(
            "SELECT display_name FROM users WHERE id = %s",
            (friend_id,)
        )
        if not friend:
            return jsonify({
                "status": "error",
                "message": "User not found."
            }), 404

        # Create notification for friend
        create_notification(
            db,
            friend_id,
            "friend",
            f"{user['display_name']} accepted your friend request!"
        )

        return jsonify({
            "status": "ok",
            "message": "Friend request accepted successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/pet/update-status", methods=["POST"])
def update_pet_status():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not all(key in data for key in ("happiness", "health")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'happiness' and 'health' are required."
        }), 400

    happiness = data["happiness"]
    health = data["health"]
    db = create_database_connection()
    try:
        # Get pet info
        pet = db.fetchone(
            "SELECT name, type FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        if not pet:
            return jsonify({
                "status": "error",
                "message": "Pet not found."
            }), 404

        # Update pet status
        db.execute(
            "UPDATE pets SET happiness = %s, health = %s WHERE user_id = %s",
            (happiness, health, user["id"])
        )

        # Create notifications for significant changes
        if happiness < 30:
            create_notification(
                db,
                user["id"],
                "pet",
                f"{pet['name']} is feeling sad! Maybe it's time for some attention? 🐾"
            )
        elif health < 30:
            create_notification(
                db,
                user["id"],
                "pet",
                f"{pet['name']} is not feeling well! Maybe it needs some care? 🐾"
            )

        return jsonify({
            "status": "ok",
            "message": "Pet status updated successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/pet/level-up", methods=["POST"])
def pet_level_up():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        # Get pet info
        pet = db.fetchone(
            "SELECT name, type, lvl FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        if not pet:
            return jsonify({
                "status": "error",
                "message": "Pet not found."
            }), 404

        # Update pet level
        new_level = pet["lvl"] + 1
        db.execute(
            "UPDATE pets SET lvl = %s WHERE user_id = %s",
            (new_level, user["id"])
        )

        # Create notification for level up
        create_notification(
            db,
            user["id"],
            "pet",
            f"🎉 {pet['name']} has reached level {new_level}! Your pet is growing stronger! 🐾"
        )

        return jsonify({
            "status": "ok",
            "message": "Pet leveled up successfully.",
            "new_level": new_level
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/achievements/unlock", methods=["POST"])
def unlock_achievement():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not all(key in data for key in ("name", "description")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'name' and 'description' are required."
        }), 400

    achievement_name = data["name"]
    achievement_description = data["description"]

    db = create_database_connection()
    try:
        # Create notification for achievement
        create_notification(
            db,
            user["id"],
            "achievement",
            f"Achievement Unlocked: {achievement_name} - {achievement_description} 🏆"
        )

        return jsonify({
            "status": "ok",
            "message": "Achievement unlocked successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/friends/message", methods=["POST"])
def send_friend_message():
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    data = request.get_json()
    if not data or not all(key in data for key in ("friend_id", "message")):
        return jsonify({
            "status": "error",
            "message": "Invalid input. 'friend_id' and 'message' are required."
        }), 400

    friend_id = data["friend_id"]
    message = data["message"]

    db = create_database_connection()
    try:
        # Get friend's display name
        friend = db.fetchone(
            "SELECT display_name FROM users WHERE id = %s",
            (friend_id,)
        )
        if not friend:
            return jsonify({
                "status": "error",
                "message": "User not found."
            }), 404

        # Create notification for friend
        create_notification(
            db,
            friend_id,
            "friend",
            f"New message from {user['display_name']}: '{message}'"
        )

        return jsonify({
            "status": "ok",
            "message": "Message sent successfully."
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    finally:
        db.close()

@app.route("/api/pet/update-time", methods=["POST"])
def update_pet_time():
    """
    Updates pet stats based on time passed.
    This should be called periodically by the frontend.
    """
    session_cookie = request.cookies.get("session")
    error_response, status_code, user = cookie_check(session_cookie)
    if error_response:
        return error_response, status_code

    db = create_database_connection()
    try:
        # Get current pet stats
        pet = db.fetchone(
            "SELECT name, type, happiness, xp, health, lvl FROM pets WHERE user_id = %s",
            (user["id"],)
        )
        if not pet:
            return jsonify({
                "status": "error",
                "message": "Pet not found."
            }), 404

        # Calculate new stats (decrease over time)
        new_happiness = max(0, pet["happiness"] - 2)  # Decrease happiness by 2, min 0
        new_health = max(0, pet["health"] - 1)  # Decrease health by 1, min 0

        # Create notifications for low stats only when crossing below 30%
        if new_happiness < 30 and pet["happiness"] >= 30:
            create_notification(
                db,
                user["id"],
                "pet",
                f"{pet['name']} is feeling sad! Maybe it's time for some attention? 🐾"
            )
        if new_health < 30 and pet["health"] >= 30:
            create_notification(
                db,
                user["id"],
                "pet",
                f"{pet['name']} is not feeling well! Maybe it needs some care? 🐾"
            )

        # Update pet stats
        db.execute(
            "UPDATE pets SET happiness = %s, health = %s WHERE user_id = %s",
            (new_happiness, new_health, user["id"])
        )

        return jsonify({
            "status": "ok",
            "message": "Pet status updated successfully.",
            "data": {
                "happiness": new_happiness,
                "health": new_health,
                "xp": pet["xp"],
                "lvl": pet["lvl"]
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


