import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../generated/prisma/client"; // relative path — no @/ alias
import { PrismaPg } from "@prisma/adapter-pg";
import { EmailSender, GmailEmailSender } from "./email-sender";
import { admin } from "better-auth/plugins";

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
    sendResetPassword(data) {
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
  user: {
    deleteUser: {
      enabled: true, // Allow administrators to delete users through the API.
    },
  },
  plugins: [admin({
    defaultRole: "external", 
    adminRoles: ["admin"], // Only users with the "admin" role will have access to the admin panel and its features.
  })], // Adding the admin plugin to manage user roles and permissions.
});
