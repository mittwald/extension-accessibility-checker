import { MongoClient } from "mongodb";
import mongoose, { Mongoose } from "mongoose";

declare global {
  // noinspection ES6ConvertVarToLetConst
  var mongoose: {
    promise: Promise<Mongoose> | null;
    connection: Mongoose | null;
  }; // This must be a `var` and not a `let / const`
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const MONGODB_URI = process.env.MONGODB_URI;
const options = {
  appName: "a11y-checker",
  bufferCommands: false,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

async function dbConnect() {
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, options);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.connection;
}

export default dbConnect;
