import bcrypt from "bcryptjs";
import { requirePrisma } from "@/lib/prisma";

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function createUser({ name, email, password }) {
  const db = requirePrisma();
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new Error("Email is already registered.");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { name: name.trim(), email: normalizedEmail, passwordHash, role: "user", lastActiveAt: new Date() }
  });
  return publicUser(user);
}

export async function authenticateUser(email, password) {
  const db = requirePrisma();
  const normalizedEmail = email.toLowerCase().trim();
  const user = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  await db.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
  return publicUser(user);
}

export async function getUserById(id) {
  const db = requirePrisma();
  const user = await db.user.findUnique({ where: { id } });
  return publicUser(user);
}
