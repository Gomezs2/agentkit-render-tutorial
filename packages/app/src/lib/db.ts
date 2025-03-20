import { Pool } from "pg";

export interface Interest {
  id: number;
  name: string;
  email: string;
}

export interface Question {
  id: number;
  interest_id: number;
  question: string;
  frequency: string;
}

export async function getInterests(): Promise<Interest[]> {
  const result = await pool.query(
    "SELECT * FROM interests ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createInterest(
  name: string,
  email: string
): Promise<Interest> {
  const result = await pool.query(
    "INSERT INTO interests (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
}

export async function deleteInterest(id: number): Promise<void> {
  await pool.query("DELETE FROM interests WHERE id = $1", [id]);
}

export async function getQuestions(): Promise<Question[]> {
  const result = await pool.query(
    "SELECT * FROM questions ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createQuestion(
  interest_id: number,
  question: string,
  frequency: string
): Promise<Question> {
  const result = await pool.query(
    "INSERT INTO questions (interest_id, question, frequency) VALUES ($1, $2, $3) RETURNING *",
    [interest_id, question, frequency]
  );
  return result.rows[0];
}

export async function deleteQuestion(id: number): Promise<void> {
  await pool.query("DELETE FROM questions WHERE id = $1", [id]);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// -- TheKnowledgeableTraveler 
interface RelatedEvent {
  name: string;
  date: string;
}

interface CreateHTEParams {
  city: string;
  year: number;
  event_name: string;
  event_date: string;
  related_events: RelatedEvent[];
}

export async function createHTE({
  city,
  year,
  event_name,
  event_date,
  related_events,
}: CreateHTEParams) {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    // Insert main event
    const eventResult = await client.query(
      'INSERT INTO events (city, year, event_name, event_date) VALUES ($1, $2, $3, $4) RETURNING event_id',
      [city, year, event_name, event_date]
    );

    const eventId = eventResult.rows[0].event_id;

    // Insert related events
    for (const relatedEvent of related_events) {
      await client.query(
        'INSERT INTO related_events (event_id, related_event_name, related_event_date) VALUES ($1, $2, $3)',
        [eventId, relatedEvent.name, relatedEvent.date]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    return {
      success: true,
      eventId,
    };

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
