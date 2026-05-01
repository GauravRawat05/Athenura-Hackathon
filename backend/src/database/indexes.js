/**
  indexes.js
  Registers important MongoDB indexes so unique constraints and query performance rules are easy to review in one place.
 */
import mongoose from "mongoose"
import { mongoUrl } from "../utils/config.js"

const connectDB  = async () => {
    try {
        const promise = await mongoose.connect(`${mongoUrl}`)
        return promise
    } catch (error) {
        console.error("ERROR", error.message)
        process.exit(1)
    }
}

export default connectDB;