-- Add status column to paired_teams table
ALTER TABLE paired_teams 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
