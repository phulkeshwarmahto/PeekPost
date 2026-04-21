import { Story } from "../models/Story.model.js";

export const runExpireStoriesJob = async () => {
  const result = await Story.deleteMany({ expiresAt: { $lte: new Date() } });
  return result.deletedCount || 0;
};