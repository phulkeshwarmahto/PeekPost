import { User } from "../models/User.model.js";

export const runExpirePremiumJob = async () => {
  const result = await User.updateMany(
    {
      isPremium: true,
      premiumExpiry: { $lte: new Date() },
    },
    {
      $set: {
        isPremium: false,
        premiumPlan: null,
        premiumExpiry: null,
        premiumBadge: false,
      },
    },
  );

  return result.modifiedCount || 0;
};