import { runExpireStoriesJob } from "./expireStories.job.js";
import { runExpirePremiumJob } from "./expirePremium.job.js";
import { runEmailDigestJob } from "./sendEmailDigest.job.js";

let started = false;

export const startBackgroundJobs = () => {
  if (started) {
    return;
  }
  started = true;

  setInterval(async () => {
    try {
      await runExpireStoriesJob();
    } catch (error) {
      console.warn("expireStories job failed", error.message);
    }
  }, 60 * 60 * 1000);

  setInterval(async () => {
    try {
      await runExpirePremiumJob();
    } catch (error) {
      console.warn("expirePremium job failed", error.message);
    }
  }, 24 * 60 * 60 * 1000);

  setInterval(async () => {
    try {
      await runEmailDigestJob();
    } catch (error) {
      console.warn("emailDigest job failed", error.message);
    }
  }, 24 * 60 * 60 * 1000);
};