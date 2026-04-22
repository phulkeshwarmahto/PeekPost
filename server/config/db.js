import mongoose from "mongoose";
import { User } from "../models/User.model.js";

const dropLegacyUserIdIndex = async () => {
  try {
    const indexes = await User.collection.indexes();
    const legacyIndex = indexes.find(
      (index) =>
        index?.key &&
        Object.keys(index.key).length === 1 &&
        index.key.userId === 1 &&
        index.unique,
    );

    if (legacyIndex) {
      await User.collection.dropIndex(legacyIndex.name);
      console.log(`Dropped legacy index: ${legacyIndex.name}`);
    }
  } catch (error) {
    // Namespace errors are expected when collection/index does not exist yet.
    if (![26, 27].includes(error?.code)) {
      console.warn("Could not reconcile legacy user indexes:", error.message);
    }
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not configured");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  await dropLegacyUserIdIndex();
  console.log("MongoDB connected");
};
