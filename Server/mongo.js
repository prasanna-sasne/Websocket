// mongo.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?authSource=admin`;
const client = new MongoClient(uri);

let messagesCollection;

export async function connectDB() {
  try {
    await client.connect();
    const db = client.db("chatapp");
    messagesCollection = db.collection("messages");
    console.log("✅ Connected to MongoDB");
    return messagesCollection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Getter for collection
export function getMessagesCollection() {
  if (!messagesCollection) {
    throw new Error("MongoDB not connected yet");
  }
  return messagesCollection;
}
