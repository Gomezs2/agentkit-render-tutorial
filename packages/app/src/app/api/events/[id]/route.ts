import { NextResponse } from 'next/server';
import { getEventById } from '@/lib/db';
import { z } from 'zod';

// Validation schema for query parameters
const querySchema = z.object({
  include_related: z.enum(['true', 'false']).default('true')
});

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const validatedQuery = querySchema.parse(queryParams);
    const includeRelated = validatedQuery.include_related === 'true';

    // Get and validate event ID
    const { id } = await context.params;
    const eventId = parseInt(id);
    if (isNaN(eventId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: [
            {
              field: 'id',
              message: 'Invalid event ID'
            }
          ]
        },
        { status: 400 }
      );
    }

    // Fetch event with or without related events
    const event = await getEventById(eventId, includeRelated);
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event
    });
  } catch (error) {
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
      {
        success: false,
        error: 'Failed to fetch event'
      },
      { status: 500 }
    );
  }
} 