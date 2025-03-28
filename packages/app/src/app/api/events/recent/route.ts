import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/db';
import { z } from 'zod';

// Validation schema for query parameters
const QueryParamsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
});

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Validate parameters
    const validatedParams = QueryParamsSchema.parse({
      limit,
    });
    
    const events = await getEvents(validatedParams.limit);
    
    return NextResponse.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching recent events:', error);

    // Handle Zod validation errors
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
      { success: false, error: 'Failed to fetch recent events' },
      { status: 500 }
    );
  }
} 