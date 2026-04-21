import nodemailer from "nodemailer";

let transporter = null;

const hasMailConfig =
  process.env.EMAIL_HOST &&
  process.env.EMAIL_PORT &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS;

if (hasMailConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log("Email transport not configured. Skipping email to", to, subject);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@peekpost.app",
    to,
    subject,
    html,
  });
};