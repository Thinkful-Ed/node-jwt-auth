-- Note the use of TEXT, not varchar or char(n)
-- https://www.postgresql.org/docs/current/datatype-character.html

CREATE TABLE listful_users (
    id SERIAL PRIMARY KEY,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE listful_items
  ADD COLUMN
    user_id INTEGER REFERENCES listful_users ON DELETE RESTRICT;
