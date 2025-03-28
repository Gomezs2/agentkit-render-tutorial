import { NextResponse } from 'next/server';
import { createHTE } from '@/lib/db';
import { z } from 'zod';

// Base event schema with common fields for both main and related events
const BaseEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  event_type: z.enum(['Significant', 'Minor', 'Workshop', 'Conference', 'Social']),
  metadata: z.record(z.any()).optional(),
});

// Validation schema for the payload
const HTEPayloadSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  event_type: z.enum(['Significant', 'Minor', 'Workshop', 'Conference', 'Social']),
  metadata: z.record(z.any()).optional(),
  city: z.string().min(1, "City is required"),
  year: z.number().int().min(2024, "Year must be 2024 or later"),
  related_events: z.array(BaseEventSchema)
    .max(20, "Maximum 20 related events allowed")
    .optional()
    .default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate and transform the payload
    const validatedData = HTEPayloadSchema.parse({
      ...body,
      // Ensure year is a number
      year: typeof body.year === 'string' ? parseInt(body.year, 10) : body.year,
    });

    // Prepare data for database entry
    const dbPayload = {
      city: validatedData.city,
      year: validatedData.year,
      event_name: validatedData.name,
      event_date: validatedData.date,
      event_type: validatedData.event_type,
      metadata: validatedData.metadata,
      related_events: (validatedData.related_events || []).map(event => ({
        name: event.name,
        date: event.date,
        event_type: event.event_type,
        metadata: event.metadata
      }))
    };

    const result = await createHTE(dbPayload);

    return NextResponse.json({ 
      success: true, 
      message: 'Event and related events created successfully',
      eventId: result.eventId 
    });

  } catch (error: unknown) {
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