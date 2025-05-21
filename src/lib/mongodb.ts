
import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection URL from environment variable
const uri = import.meta.env.VITE_MONGODB_URI;

// Cache connection between function calls
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

if (!uri) {
  throw new Error(
    "Please define the VITE_MONGODB_URI environment variable"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let globalWithMongo = global as typeof global & {
  mongo: {
    conn: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
};

if (!globalWithMongo.mongo) {
  globalWithMongo.mongo = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!globalWithMongo.mongo.promise) {
    const opts = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    globalWithMongo.mongo.promise = MongoClient.connect(uri);
  }
  
  try {
    const client = await globalWithMongo.mongo.promise;
    const db = client.db();
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    throw e;
  }
}

export async function getClient() {
  const { client } = await connectToDatabase();
  return client;
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}
