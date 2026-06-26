import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
let client;
let clientPromise;

if (!uri) {
  throw new Error('MONGO_URL is not set');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const c = await clientPromise;
  const dbName = process.env.DB_NAME || 'aitoolhub';
  return c.db(dbName);
}
