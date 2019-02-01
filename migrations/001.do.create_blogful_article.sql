CREATE TABLE blogful_articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT
);
