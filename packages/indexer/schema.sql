
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

-- Create the unified events table with hierarchical structure
CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- Significant, Minor, etc.
    event_date DATE NOT NULL,
    parent_event_id INT REFERENCES events(event_id) ON DELETE SET NULL, -- Self-reference for hierarchical relationship
    metadata JSONB, -- Flexible field for additional event-specific details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
