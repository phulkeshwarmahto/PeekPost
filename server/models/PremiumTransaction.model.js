import mongoose from "mongoose";

const premiumTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, default: "" },
    plan: { type: String, enum: ["monthly", "yearly"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending" },
    gateway: { type: String, enum: ["razorpay", "stripe"], required: true },
  },
  { timestamps: true },
);

export const PremiumTransaction = mongoose.model("PremiumTransaction", premiumTransactionSchema);