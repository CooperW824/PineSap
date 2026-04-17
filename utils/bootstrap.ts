import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createAuthClient } from "better-auth/client";
import { Command } from "commander";
import * as readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
	adapter,
});

const client = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

// General-purpose prompt function
function prompt(question: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
}

// --- Types ---

interface BootstrapOptions {
	name?: string;
	email?: string;
	password?: string;
}

// --- Command ---

const program = new Command();

program
	.name("bootstrap")
	.description("Bootstrap the application with an initial admin user")
	.version("1.0.0")
	.option("-n, --name <name>", "Admin name (skips prompt)")
	.option("-e, --email <email>", "Admin email (skips prompt)")
	.option("-p, --password <password>", "Admin password (skips prompt)");

program.action(async (options: BootstrapOptions) => {
	console.log("🚀 PineSap Bootstrapper!\n");

	const name = options.name ?? (await prompt("Admin Name: "));
	if (!name.trim()) {
		console.error("Error: name cannot be empty.");
		process.exit(1);
	}

	const email = options.email ?? (await prompt("Email: "));
	if (!email.trim()) {
		console.error("Error: email cannot be empty.");
		process.exit(1);
	}

	const password = options.password ?? (await prompt("Password: "));
	if (!password.trim()) {
		console.error("Error: password cannot be empty.");
		process.exit(1);
	}

	console.log("\nBootstrapping...");
	console.log(`  Name : ${name}`);
	console.log(`  Email : ${email}`);
	console.log(`  Password : ${"*".repeat(password.length)}`);

	const resp = await client.signUp
		.email({
			name,
			email,
			password,
			fetchOptions: {
				headers: {
					Origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
				},
			},
		})
		.catch((err) => {
			console.error("Error during sign-up:", err);
			process.exit(1);
		});

	if (resp.error) {
		console.error("Error during sign-up:", resp.error);
		process.exit(1);
	}

	// Giving the user the "admin" role so they can access the admin panel and manage other users.
	const user = resp.data.user;

	const roleResp = await prisma.user.update({
		where: { id: user.id },
		data: { role: "admin" },
	});

	if (!roleResp) {
		console.error("Failed to assign admin role to the user.");
		process.exit(1);
	}

	console.log("\n✅ Done.");
});

program.parseAsync(process.argv);
