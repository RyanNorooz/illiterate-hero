import type { ConnectOptions } from 'mongoose'
import mongoose, { connect } from 'mongoose'

mongoose.set('strictQuery', true)

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI)
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const globalWithMongoose = global as typeof global & { mongoose: any }
let cached = globalWithMongoose.mongoose
if (!cached) cached = globalWithMongoose.mongoose = { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const opts: ConnectOptions = { bufferCommands: false }
    cached.promise = connect(MONGODB_URI, opts).then((mongoosePromise) => mongoosePromise)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
