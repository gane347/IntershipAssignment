ALTER TABLE "games"
ALTER COLUMN "digital_key_encrypted" DROP DEFAULT;

ALTER TABLE "games"
ADD CONSTRAINT "games_digital_key_encrypted_format"
CHECK ("digital_key_encrypted" ~ '^[0-9a-fA-F]+:[0-9a-fA-F]+:[0-9a-fA-F]+$');
