import { NextResponse } from 'next/server';
import { searchEvents } from '@/lib/db';
import { z } from 'zod';

// Validation schema for search parameters
const SearchParamsSchema = z.object({
  city: z.string().min(1).optional(),
  year: z.number().int().min(2024).optional(),
  limit: z.number().min(1).max(100).optional().default(10),
});

export async function GET(request: Request) {
  try {
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10;

    // Validate parameters
    const validatedParams = SearchParamsSchema.parse({
      city,
      year,
      limit,
    });

    // Search for events
    const events = await searchEvents(
      validatedParams.city,
      validatedParams.year,
      validatedParams.limit
    );

    return NextResponse.json({ 
      success: true, 
      events 
    });

  } catch (error) {
    console.error('Error searching events:', error);
    
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
      { success: false, error: 'Failed to search events' },
      { status: 500 }
    );
  }
} 