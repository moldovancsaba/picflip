import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Safely serializes a document/object for JSON response
 * Handles dates, ObjectIds, and undefined values
 */
export function serializeData(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (data instanceof mongoose.Types.ObjectId) {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }

  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values
      if (value !== undefined) {
        serialized[key] = serializeData(value);
      }
    }
    return serialized;
  }

  return data;
}

/**
 * Creates a standardized API response
 */
export function createApiResponse(
  data: any = null,
  status: number = 200,
  message: string | null = null,
  error: string | null = null
) {
  const response: any = {};

  // Always include a timestamp
  response.timestamp = new Date().toISOString();

  // Add main response data if present
  if (data !== null) {
    response.data = serializeData(data);
  }

  // Add message if present
  if (message) {
    response.message = message;
  }

  // Add error if present
  if (error) {
    response.error = error;
  }

  // Ensure the response can be properly stringified
  try {
    JSON.stringify(response);
  } catch (e) {
    console.error('Response serialization error:', e);
    return NextResponse.json(
      {
        error: 'Internal server error: Response serialization failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }

  return NextResponse.json(response, { status });
}
