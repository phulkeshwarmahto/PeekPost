const LOCAL_DEV_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const normalizeOrigin = (origin) => {
  if (!origin || typeof origin !== "string") {
    return "";
  }

  const trimmedOrigin = origin.trim().replace(/\/+$/, "");
  if (!trimmedOrigin) {
    return "";
  }

  try {
    const parsed = new URL(
      trimmedOrigin.includes("://") ? trimmedOrigin : `https://${trimmedOrigin}`,
    );
    return `${parsed.protocol}//${parsed.host}`;
  } catch (_error) {
    return "";
  }
};

const parseConfiguredOrigins = () => {
  const rawConfiguredOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS,
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
  ]
    .filter(Boolean)
    .join(",");

  const configuredOrigins = rawConfiguredOrigins
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  const defaultOrigins = ["http://localhost:5173", "http://localhost:3000"];
  if (process.env.NODE_ENV === "production") {
    defaultOrigins.push("https://peekpost.vercel.app");
  }

  const normalizedDefaultOrigins = defaultOrigins
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  return [...new Set([...normalizedDefaultOrigins, ...configuredOrigins])];
};

const allowedOrigins = parseConfiguredOrigins();
const allowedOriginSet = new Set(allowedOrigins);

export const getAllowedOrigins = () => [...allowedOrigins];

export const isLocalDevOrigin = (origin) => LOCAL_DEV_ORIGIN_PATTERN.test(origin || "");

export const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    return false;
  }

  return allowedOriginSet.has(normalizedOrigin) || isLocalDevOrigin(normalizedOrigin);
};
