CREATE TABLE blogful_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT
);
