-- CREATE EXTENSION IF NOT EXISTS vector;

-- CREATE TABLE IF NOT EXISTS interests (
--   id SERIAL PRIMARY KEY,
--   name TEXT,
--   email TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS stories (
--   id SERIAL PRIMARY KEY,
--   title TEXT,
--   content TEXT,
--   date DATE,
--   comments TEXT,
--   interest_id INTEGER REFERENCES interests(id),
--   embedding vector(1536)
-- );

-- -- Create an index on the embedding column for faster similarity searches
-- CREATE INDEX IF NOT EXISTS stories_embedding_idx ON stories 
-- USING hnsw (embedding vector_cosine_ops);

-- CREATE TABLE IF NOT EXISTS questions (
--   id SERIAL PRIMARY KEY,
--   interest_id INTEGER REFERENCES interests(id),
--   question TEXT,
--   frequency TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- TheKnowledgeableTraveler 
CREATE EXTENSION IF NOT EXISTS vector;

-- Stores significant event data for a city
CREATE TABLE IF NOT EXISTS events (
    event_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    city VARCHAR(255),
    year INT,
    event_name VARCHAR(255),
    event_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stores minor events data for a city
CREATE TABLE IF NOT EXISTS related_events (
    related_event_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    related_event_name VARCHAR(255),
    related_event_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

