import { MongoClient } from 'mongodb';

const { DATABASE_URL = '' } = process.env;

export const client = new MongoClient(DATABASE_URL);
export const db = client.db();
