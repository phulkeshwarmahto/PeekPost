import crypto from "crypto";

import { PremiumTransaction } from "../models/PremiumTransaction.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const PLAN_CONFIG = {
  monthly: {
    durationDays: 30,
    inr: Number(process.env.PREMIUM_MONTHLY_PRICE_INR || 8900),
    usd: Number(process.env.PREMIUM_MONTHLY_PRICE_USD || 199),
  },
  yearly: {
    durationDays: 365,
    inr: Number(process.env.PREMIUM_YEARLY_PRICE_INR || 69900),
    usd: Number(process.env.PREMIUM_YEARLY_PRICE_USD || 1499),
  },
};

export const getPlans = asyncHandler(async (_req, res) => {
  res.json(PLAN_CONFIG);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { plan = "monthly", currency = "INR", gateway = "razorpay" } = req.body;
  const selected = PLAN_CONFIG[plan];

  if (!selected) {
    const error = new Error("Invalid plan");
    error.status = 400;
    throw error;
  }

  const normalizedCurrency = currency.toUpperCase();
  const amount = normalizedCurrency === "USD" ? selected.usd : selected.inr;

  const orderId = `${gateway}_order_${crypto.randomUUID()}`;

  const transaction = await PremiumTransaction.create({
    user: req.user._id,
    orderId,
    plan,
    amount,
    currency: normalizedCurrency,
    gateway,
    status: "pending",
  });

  res.status(201).json({
    orderId,
    transactionId: transaction._id,
    amount,
    currency: normalizedCurrency,
    plan,
    gateway,
  });
});

export const webhook = asyncHandler(async (req, res) => {
  const { orderId, paymentId, status = "success" } = req.body;

  const transaction = await PremiumTransaction.findOne({ orderId });
  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  transaction.paymentId = paymentId || transaction.paymentId;
  transaction.status = status;
  await transaction.save();

  if (status === "success") {
    const durationDays = PLAN_CONFIG[transaction.plan].durationDays;
    const now = new Date();
    const expiry = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(transaction.user, {
      $set: {
        isPremium: true,
        premiumPlan: transaction.plan,
        premiumExpiry: expiry,
        premiumBadge: true,
      },
    });
  }

  res.json({ ok: true });
});

export const getStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("isPremium premiumPlan premiumExpiry premiumBadge");

  const active = user.isPremium && user.premiumExpiry && new Date(user.premiumExpiry).getTime() > Date.now();

  res.json({
    isPremium: active,
    premiumPlan: active ? user.premiumPlan : null,
    premiumExpiry: active ? user.premiumExpiry : null,
    premiumBadge: active ? user.premiumBadge : false,
  });
});

export const cancelPremium = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      isPremium: false,
      premiumPlan: null,
      premiumExpiry: null,
      premiumBadge: false,
    },
  });

  res.json({ message: "Premium subscription canceled" });
});