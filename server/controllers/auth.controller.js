import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/User.model.js";
import { createAccessToken, createRefreshToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

const resetOtpStore = new Map();
const emailVerificationStore = new Map();

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  fullName: user.fullName,
  bio: user.bio,
  avatar: user.avatar,
  isPremium: user.isPremium,
  premiumPlan: user.premiumPlan,
  premiumExpiry: user.premiumExpiry,
  premiumBadge: user.premiumBadge,
});

const issueTokens = async (user, res) => {
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return { accessToken, refreshToken };
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!username || !email || !password) {
    const error = new Error("username, email and password are required");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    fullName: fullName || username,
  });

  const verificationToken = crypto.randomBytes(16).toString("hex");
  emailVerificationStore.set(verificationToken, user._id.toString());

  await sendEmail({
    to: user.email,
    subject: "Verify your PeekPost email",
    html: `<p>Verification token: <strong>${verificationToken}</strong></p>`,
  });

  const tokens = await issueTokens(user, res);

  res.status(201).json({
    user: sanitizeUser(user),
    ...tokens,
    message: "Registered successfully",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    const error = new Error("Credentials are required");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({
    $or: [
      { email: emailOrUsername.toLowerCase() },
      { username: emailOrUsername.toLowerCase() },
    ],
  });

  if (!user || !user.password) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const tokens = await issueTokens(user, res);

  res.json({
    user: sanitizeUser(user),
    ...tokens,
  });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } });
  }

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "Logged out" });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    const error = new Error("Refresh token required");
    error.status = 401;
    throw error;
  }

  const user = await User.findOne({ refreshToken: incomingRefreshToken });
  if (!user) {
    const error = new Error("Invalid refresh token");
    error.status = 401;
    throw error;
  }

  const tokens = await issueTokens(user, res);

  res.json({
    user: sanitizeUser(user),
    ...tokens,
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { googleId, email, username, fullName, avatar } = req.body;

  if (!googleId || !email) {
    const error = new Error("googleId and email are required");
    error.status = 400;
    throw error;
  }

  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      googleId,
      email,
      username: username || email.split("@")[0],
      fullName: fullName || email.split("@")[0],
      avatar: avatar || "",
      isVerified: true,
      password: null,
    });
  }

  const tokens = await issueTokens(user, res);

  res.json({
    user: sanitizeUser(user),
    ...tokens,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user) {
    res.json({ message: "If this email exists, an OTP has been sent" });
    return;
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  resetOtpStore.set(user.email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  await sendEmail({
    to: user.email,
    subject: "PeekPost reset OTP",
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
  });

  res.json({ message: "If this email exists, an OTP has been sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = resetOtpStore.get(email?.toLowerCase());
  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    const error = new Error("Invalid or expired OTP");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { password: hashedPassword } });

  resetOtpStore.delete(email.toLowerCase());
  res.json({ message: "Password reset successful" });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId = emailVerificationStore.get(token);

  if (!userId) {
    const error = new Error("Invalid verification token");
    error.status = 400;
    throw error;
  }

  await User.findByIdAndUpdate(userId, { $set: { isVerified: true } });
  emailVerificationStore.delete(token);

  res.json({ message: "Email verified successfully" });
});