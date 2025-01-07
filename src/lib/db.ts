import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'test') {
    console.log('Waiting for MongoDB Memory Server to initialize...');
  } else {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
}

const MONGODB_URI = process.env.MONGODB_URI as string;

let cached = (global as { mongoose?: MongooseCache }).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = (global as { mongoose?: MongooseCache }).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
