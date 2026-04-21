import { User } from "../models/User.model.js";

export const runEmailDigestJob = async () => {
  const count = await User.countDocuments();
  return count;
};