const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://placeholder:placeholder@localhost:5432/imagescenter?schema=public"
  }
});
