-- Add registration columns to tournaments table
-- Support up to 2 contacts
alter table tournaments 
add column if not exists registration_contact1_name text,
add column if not exists registration_contact1_wechat text,
add column if not exists registration_contact1_qr text,
add column if not exists registration_contact2_name text,
add column if not exists registration_contact2_wechat text,
add column if not exists registration_contact2_qr text;
