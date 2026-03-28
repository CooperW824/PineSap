import { Role } from "@/lib/server/authorization/roles";
import { DatabaseObject } from "@/lib/server/DatabaseModels/database-object";
import prisma from "@/lib/server/prisma";
import { auth } from "../auth";

export interface User {
  get id(): string;
  get name(): string;
  get email(): string;
  get role(): Role;
  set name(name: string);
  set email(email: string);
  set role(role: Role);
}

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

function randomPassword(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/** User implementation that persists to the database. This would be a wrapper around the Prisma User model, and would implement the User interface.
 */
export class PersistedUser extends DatabaseObject implements User {
  private m_name: string;
  private m_email: string;
  private m_role: Role;

  constructor(id: string) {
    super(id);
    // Fetch the user from the database using the id, and populate the fields of the object.
    // Throw an error if the user is not found.

    // Initialize fields to default values while the database query is in progress.
    this.m_name = "";
    this.m_email = "";
    this.m_role = "external";

    prisma.user.findUnique({ where: { id } }).then((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      this.m_name = user.name;
      this.m_email = user.email;
      this.m_role = user.role as Role;
    });
  }

  static async create(data: {
    name: string;
    email: string;
    role?: Role;
  }): Promise<PersistedUser> {
    // Creates a new user in the database using BetterAuth
    const resp = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: randomPassword(12), // Generate a random password since the user will set their own password through the forgot password flow.
      },
    });

    const resetResp = await auth.api.requestPasswordReset({
      body: {
        email: data.email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`, // The URL the user will be sent to after they reset their password. This should be a page in your frontend that handles the password reset flow.
      },
    });

    if (resetResp.status === false) {
      throw new Error("Failed to request password reset: " + resetResp.message);
    }

    // Update the user's role if it's provided (the default is "external")
    if (data.role && data.role !== "external") {
      await prisma.user.update({
        where: { id: resp.user.id },
        data: { role: data.role },
      });
    }

    return new PersistedUser(resp.user.id);
  }

  async delete(): Promise<void> {
    const resp = await auth.api.removeUser({ body: { userId: this.id } });
    if (!resp.success) {
      throw new Error("Failed to delete user: ");
    }

    return Promise.resolve();
  }

  static async count(): Promise<number> {
    const resp = await prisma.user.count();
    return resp;
  }

  static async list(
    page_size: number,
    page_number: number,
  ): Promise<UserData[]> {
    // Return a paginated list of objects from the database.
    const resp = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      take: page_size,
      skip: page_number * page_size,
      orderBy: { createdAt: "desc" },
    });
    return resp;
  }

  get name(): string {
    return this.m_name;
  }

  set name(name: string) {
    this.m_name = name;
    prisma.user.update({ where: { id: this.id }, data: { name } });
  }

  get email(): string {
    return this.m_email;
  }

  set email(email: string) {
    this.m_email = email;
    prisma.user.update({ where: { id: this.id }, data: { email } });
  }

  get role(): Role {
    return this.m_role;
  }

  set role(role: Role) {
    this.m_role = role;
    prisma.user.update({ where: { id: this.id }, data: { role } });
  }
}

// A mock user implementation for testing purposes. This would not persist to the database, and would just be used for testing the authorization logic.
export class MockUser implements User {
  private m_id: string;
  private m_name: string;
  private m_email: string;
  private m_role: Role;

  constructor(id: string, name: string, email: string, role: Role) {
    this.m_id = id;
    this.m_name = name;
    this.m_email = email;
    this.m_role = role;
  }

  get id(): string {
    return this.m_id;
  }

  get name(): string {
    return this.m_name;
  }

  get email(): string {
    return this.m_email;
  }

  get role(): Role {
    return this.m_role;
  }

  set name(name: string) {
    this.m_name = name;
  }

  set email(email: string) {
    this.m_email = email;
  }

  set role(role: Role) {
    this.m_role = role;
  }
}
