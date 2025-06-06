-- Add new columns to user_descriptions table
ALTER TABLE user_descriptions
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS favorite_pet_type TEXT CHECK (favorite_pet_type IN ('cat', 'duck', 'bat', 'dog')),
ADD COLUMN IF NOT EXISTS join_date TIMESTAMPTZ DEFAULT NOW(); 