import bcrypt from "bcryptjs";
import { connectToDatabase } from "../src/lib/db";
import User from "../src/models/User";

async function main() {
  await connectToDatabase();

  const email = "admin@avianacollection.in";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("SUPER_ADMIN already exists:", email);
    return;
  }

  await User.create({
    name: "Aviana Super Admin",
    email,
    passwordHash: await bcrypt.hash("ChangeMe@12345", 12),
    role: "SUPER_ADMIN",
    status: "active"
  });

  console.log("Created SUPER_ADMIN:", email);
  console.log("Temporary password: ChangeMe@12345");
  console.log("Change this password immediately after first login.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
