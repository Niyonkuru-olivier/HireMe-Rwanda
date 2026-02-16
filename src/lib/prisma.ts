import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PoolConfig } from "mariadb";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not defined");
}

// Parse the connection string into pool config
const url = new URL(connectionString);
const poolConfig: PoolConfig = {
	host: url.hostname,
	port: url.port ? parseInt(url.port) : 3306,
	user: url.username,
	password: url.password,
	database: url.pathname.slice(1), // Remove leading slash
};

const adapter = new PrismaMariaDb(poolConfig);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: ["error", "warn"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
