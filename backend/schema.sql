CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT,  -- e.g., 'America/Los_Angeles'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE user_geolocations (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_descriptions (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    recurrence_type TEXT NOT NULL CHECK (
        recurrence_type IN ('hourly', 'daily', 'weekly', 'monthly', 'weekdays', 'weekends')
    ),
   -- assume hourly means next XX:00, other means midnight user local time = due time.
    -- Time of the last successful completion (UTC)
    last_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    archived BOOLEAN DEFAULT FALSE
);

CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cat', 'duck', 'bat', 'dog')),
    happiness INTEGER NOT NULL CHECK (happiness BETWEEN 0 AND 100) DEFAULT 50,
    xp INTEGER NOT NULL CHECK (xp BETWEEN 0 AND 100) DEFAULT 0,
    health INTEGER NOT NULL CHECK (health BETWEEN 0 AND 100) DEFAULT 100,
    lvl INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE friends (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id),
    CHECK (user_id <> friend_id)
);

CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0 NOT NULL, -- check if should reset on login or someone loads their profile, or friends page load
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    total_habits_completed INTEGER DEFAULT 0 NOT NULL,
    last_completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_passwords (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cookies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cookie_value TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- TODO: authentication table for external sign-in 
-- TODO: achievements table?
-- TODO: preset list of habits table
