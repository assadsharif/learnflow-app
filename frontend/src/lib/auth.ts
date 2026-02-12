import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "learnflow-dev-secret-change-in-production",
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL || "postgresql://learnflow:learnflow@localhost:5432/learnflow",
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
