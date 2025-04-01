// lib/prisma.js or utils/prisma.js

const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

let globalForPrisma = globalThis;

const prismaClient =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prismaClient;

module.exports = prismaClient;
