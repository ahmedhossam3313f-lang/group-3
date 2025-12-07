
import { DatabaseStorage } from "./db-storage";
import bcrypt from "bcrypt";

async function createAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const storage = new DatabaseStorage(process.env.DATABASE_URL);
  
  const username = "admin";
  const password = "admin123"; // Change this!
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await storage.createAdminUser({
      username,
      passwordHash,
      email: "admin@grouptherapy.com",
      role: "admin",
      isActive: true,
    });
    console.log(`Admin user created: ${username}`);
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin();
