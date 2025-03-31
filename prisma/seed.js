const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { BOT } = require("../src/constants/bot");

async function main() {
  const hashedPass = await bcrypt.hash(BOT.password, 10);
  const admin = await prisma.user.upsert({
    where: { email: BOT.email },
    update: {},
    create: {
      email: BOT.email,
      name: BOT.name,
      password: hashedPass,
      role: BOT.role,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
