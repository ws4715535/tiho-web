-- Add pdf_url column to tournaments table
alter table tournaments 
add column if not exists pdf_url text;
