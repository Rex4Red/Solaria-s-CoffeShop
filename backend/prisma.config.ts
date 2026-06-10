// Use DIRECT_URL for Prisma CLI (migrations, introspect, push)
// Use DATABASE_URL (pooled) for Prisma Client at runtime
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts",
  },
  datasource: {
    // CLI operations (migrate, push, introspect) use direct connection
    url: process.env["DIRECT_URL"],
  },
});
