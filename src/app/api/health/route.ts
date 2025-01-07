import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import Redis from 'ioredis';

export async function GET() {
  try {
    // Check MongoDB connection
    const mongoClient = await MongoClient.connect(
      process.env.MONGODB_URI as string
    );
    await mongoClient.db().admin().ping();
    await mongoClient.close();

    // Check Redis connection if configured
    if (process.env.REDIS_URL) {
      const redis = new Redis(process.env.REDIS_URL);
      await redis.ping();
      await redis.quit();
    }

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          cache: process.env.REDIS_URL ? 'connected' : 'not_configured',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
