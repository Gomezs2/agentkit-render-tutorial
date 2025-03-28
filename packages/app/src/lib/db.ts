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

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// -- TheKnowledgeableTraveler 

// Interface for the Event data structure
export interface Event {
  event_id: number;
  city: string;
  year: number;
  event_name: string;
  event_type: string;
  event_date: string;
  parent_event_id: number | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Interface for a main event with its related events
export interface EventWithRelated {
  mainEvent: Event;
  relatedEvents: Event[];
}

interface CreateHTEParams {
  city: string;
  year: number;
  event_name: string;
  event_date: string;
  event_type: string;
  metadata?: Record<string, any>;
  related_events: RelatedEvent[];
}

interface RelatedEvent {
  name: string;
  date: string;
  event_type: string;
  metadata?: Record<string, any>;
}

export async function createHTE({
  city,
  year,
  event_name,
  event_date,
  event_type,
  metadata,
  related_events,
}: CreateHTEParams) {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    // Insert main event
    const eventResult = await client.query(
      'INSERT INTO events (city, year, event_name, event_date, event_type, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING event_id',
      [city, year, event_name, event_date, event_type, metadata ? JSON.stringify(metadata) : null]
    );

    const parentEventId = eventResult.rows[0].event_id;

    // Insert related events as child events in the unified events table
    for (const relatedEvent of related_events) {
      await client.query(
        'INSERT INTO events (city, year, event_name, event_date, event_type, parent_event_id, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          city, 
          year, 
          relatedEvent.name, 
          relatedEvent.date, 
          relatedEvent.event_type,
          parentEventId,
          relatedEvent.metadata ? JSON.stringify(relatedEvent.metadata) : null
        ]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    return {
      success: true,
      eventId: parentEventId,
    };

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get events with their related events
 * @param limit Optional limit for the number of main events to retrieve
 * @returns Array of main events with their related events
 */
export async function getEvents(limit: number = 10): Promise<EventWithRelated[]> {
  const client = await pool.connect();
  
  try {
    // Get main events (events with no parent)
    const mainEventsResult = await client.query<Event>(
      'SELECT * FROM events WHERE parent_event_id IS NULL ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    
    const mainEvents = mainEventsResult.rows;
    const result: EventWithRelated[] = [];
    
    // For each main event, get its related events
    for (const mainEvent of mainEvents) {
      const relatedEventsResult = await client.query<Event>(
        'SELECT * FROM events WHERE parent_event_id = $1 ORDER BY event_date',
        [mainEvent.event_id]
      );
      
      result.push({
        mainEvent,
        relatedEvents: relatedEventsResult.rows
      });
    }
    
    return result;
  } finally {
    client.release();
  }
}

/**
 * Get an event by ID
 * @param eventId - The ID of the event to retrieve
 * @param includeRelated - Whether to include related events in the response
 * @returns The event with its related events if includeRelated is true, or just the event if false
 */
export async function getEventById(eventId: number, includeRelated: boolean = true) {
  const client = await pool.connect();
  try {
    // Get the event
    const eventResult = await client.query(
      `SELECT * FROM events WHERE event_id = $1`,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return null;
    }

    const event = eventResult.rows[0];

    // If we don't need related events, return just the event
    if (!includeRelated) {
      return event;
    }

    // If this is a related event, get its parent and siblings
    if (event.parent_event_id) {
      const parentResult = await client.query(
        `SELECT * FROM events WHERE event_id = $1`,
        [event.parent_event_id]
      );

      if (parentResult.rows.length === 0) {
        return null;
      }

      const parentEvent = parentResult.rows[0];
      const siblingsResult = await client.query(
        `SELECT * FROM events WHERE parent_event_id = $1 AND event_id != $2`,
        [parentEvent.event_id, eventId]
      );

      return {
        mainEvent: parentEvent,
        relatedEvents: [event, ...siblingsResult.rows]
      };
    }

    // If this is a main event, get its related events
    const relatedResult = await client.query(
      `SELECT * FROM events WHERE parent_event_id = $1`,
      [eventId]
    );

    return {
      mainEvent: event,
      relatedEvents: relatedResult.rows
    };
  } finally {
    client.release();
  }
}

/**
 * Search events by city and/or year
 * @param city Optional city to filter by
 * @param year Optional year to filter by
 * @param limit Optional limit for the number of results
 * @returns Array of matching events
 */
export async function searchEvents(
  city?: string,
  year?: number,
  limit: number = 10
): Promise<EventWithRelated[]> {
  const client = await pool.connect();
  
  try {
    let query = 'SELECT * FROM events WHERE parent_event_id IS NULL';
    const params: any[] = [];
    
    // Add filters if provided
    if (city) {
      params.push(city.toLowerCase()); // Convert city to lowercase for case-insensitive comparison
      query += ` AND LOWER(city) = LOWER($${params.length})`;
    }
    
    if (year) {
      params.push(year);
      query += ` AND year = $${params.length}`;
    }
    
    // Add ordering and limit
    params.push(limit);
    query += ` ORDER BY created_at DESC LIMIT $${params.length}`;
    
    // Get main events based on filters
    const mainEventsResult = await client.query<Event>(query, params);
    const mainEvents = mainEventsResult.rows;
    const result: EventWithRelated[] = [];
    
    // For each main event, get its related events
    for (const mainEvent of mainEvents) {
      const relatedEventsResult = await client.query<Event>(
        'SELECT * FROM events WHERE parent_event_id = $1 ORDER BY event_date',
        [mainEvent.event_id]
      );
      
      result.push({
        mainEvent,
        relatedEvents: relatedEventsResult.rows
      });
    }
    
    return result;
  } finally {
    client.release();
  }
}

