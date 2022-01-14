CREATE USER suraj SUPERUSER PASSWORD 'root';
CREATE DATABASE payzer;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_no VARCHAR(20) UNIQUE NOT NULL,
    country VARCHAR(20) NOT NULL,
    otp TEXT NOT NULL,
    name VARCHAR(50) NOT NULL,
    profile_picture TEXT NOT NULL,
    credit NUMERIC(999, 9) DEFAULT 10000.00,
    debit NUMERIC(999, 9) DEFAULT 0.00,
    card_count INT DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    credit NUMERIC(999, 9) DEFAULT 0.00,
    debit NUMERIC(999, 9) DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL,
    reciever_id UUID NOT NULL,
    card_id UUID NOT NULL,
    amount NUMERIC(999, 9) DEFAULT 0.00,
    rate NUMERIC(999, 9) DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE OR REPLACE FUNCTION add_primary_card()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cards(user_id, is_primary, credit) 
    VALUES (new.id, TRUE, 10000.00);
    RETURN NEW;
END; $$ LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER new_user_side_effect AFTER INSERT ON users
FOR EACH ROW
EXECUTE PROCEDURE add_primary_card();

CREATE OR REPLACE FUNCTION add_new_card_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF new.is_primary = FALSE THEN
        INSERT INTO transactions(sender_id, reciever_id, card_id, amount, rate)
        VALUES (new.user_id, new.user_id, new.id, new.credit, 1);
        UPDATE users 
        SET card_count = card_count + 1,
            credit = credit + new.credit
        WHERE id = new.user_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END; $$ LANGUAGE 'plpgsql';

CREATE OR REPLACE TRIGGER new_card_side_effect AFTER INSERT ON cards
FOR EACH ROW
EXECUTE PROCEDURE add_new_card_transaction();