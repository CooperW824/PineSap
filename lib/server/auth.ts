import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client"; // relative path — no @/ alias
import { PrismaPg } from "@prisma/adapter-pg";
import { EmailSender, GmailEmailSender } from "./email-sender";

const authEmailSender: EmailSender = new GmailEmailSender();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    sendResetPassword(data, request) {
      return authEmailSender.sendEmail(
        data.user.email,
        "PineSap Password Reset",
        `<p>You requested a password reset. Click the link below to reset your password:</p>
         <a href="${data.url}">Reset Password</a>
         <p>If you did not request this, please ignore this email.</p>
         <p>Best,<br/>The PineSap Team</p>`,
      );
    },
  },
});
