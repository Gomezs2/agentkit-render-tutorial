import { NextResponse } from 'next/server';
import { createHTE } from '@/lib/db';
import { z } from 'zod';

// Validation schema for the payload
const RelatedEventSchema = z.object({
  name: z.string().min(1, "Related event name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
});

const HTEPayloadSchema = z.object({
  city: z.string().min(1, "City is required"),
  year: z.number().int().min(2024, "Year must be 2024 or later"),
  event_name: z.string().min(1, "Event name is required"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  related_events: z.array(RelatedEventSchema)
    .min(1, "At least one related event is required")
    .max(10, "Maximum 10 related events allowed")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate and transform the payload
    const validatedData = HTEPayloadSchema.parse({
      ...body,
      // Ensure year is a number
      year: typeof body.year === 'string' ? parseInt(body.year, 10) : body.year
    });

    const result = await createHTE(validatedData);

    return NextResponse.json({ 
      success: true, 
      message: 'Event and related events created successfully',
      eventId: result.eventId 
    });

  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 