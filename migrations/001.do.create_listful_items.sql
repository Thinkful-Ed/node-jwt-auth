CREATE TABLE listful_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    checked BOOLEAN DEFAULT false NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL
);
