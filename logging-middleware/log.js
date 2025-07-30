import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const {
  AUTH_URL,
  LOGGING_URL,
  EMAIL,
  NAME,
  ROLL_NO,
  ACCESS_CODE,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env;

let tokenCache = {
  token: null,
  expiresAt: 0,
};

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache.token && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  try {
    const response = await axios.post(AUTH_URL, {
      email: EMAIL,
      name: NAME,
      rollNo: ROLL_NO,
      accessCode: ACCESS_CODE,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    });

    tokenCache.token = response.data.access_token;
    tokenCache.expiresAt = response.data.expires_in;
    return tokenCache.token;
  } catch (err) {
    console.error("[Logger] Failed to fetch token:", err.message);
    throw new Error("Authentication failed");
  }
}

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = {
  backend: [
    "cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service",
  ],
  frontend: ["api", "component", "hook", "page", "state", "style"],
  common: ["auth", "config", "middleware", "utils"],
};

function isValidPackage(stack, pkg) {
  return VALID_PACKAGES.common.includes(pkg) || VALID_PACKAGES[stack]?.includes(pkg);
}

export async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    return console.error(`[Logger] Invalid stack "${stack}"`);
  }

  if (!VALID_LEVELS.includes(level)) {
    return console.error(`[Logger] Invalid level "${level}"`);
  }

  if (!isValidPackage(stack, pkg)) {
    return console.error(`[Logger] Invalid package "${pkg}" for stack "${stack}"`);
  }

  try {
    const token = await getAccessToken();
    const response = await axios.post(
      LOGGING_URL,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Logger] ${response.data.message} (Log ID: ${response.data.logID})`);
  } catch (error) {
    console.error(`[Logger] Failed to send log: ${error.message}`);
  }
}
