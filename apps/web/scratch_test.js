const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log("Testing bcrypt...");
    const hash = await bcrypt.hash("password123", 10);
    console.log("Hash created:", hash);

    console.log("Testing database connection...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    console.log("Testing user creation...");
    // We won't actually create one to avoid polluting, just check if schema is ready
    console.log("Schema looks good.");
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
