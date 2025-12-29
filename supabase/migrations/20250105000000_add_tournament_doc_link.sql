-- Add doc_link column to tournaments table
alter table tournaments 
add column if not exists doc_link text;
