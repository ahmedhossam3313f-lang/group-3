import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { signToken, verifyToken, requireAuth as jwtRequireAuth, type JWTPayload } from "./jwt-auth";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const ATTEMPT_WINDOW_MINUTES = 15;

export async function createSession(username: string): Promise<string> {
  const adminUser = await storage.getAdminUserByUsername(username);
  const token = signToken({
    username,
    role: adminUser?.role || "admin",
    userId: adminUser?.id || 0,
  });
  return token;
}

export async function validateSession(token: string): Promise<string | null> {
  const payload = verifyToken(token);
  if (!payload) return null;
  return payload.username;
}

export async function validateSessionWithPayload(token: string): Promise<JWTPayload | null> {
  return verifyToken(token);
}

export async function deleteSession(sessionId: string): Promise<void> {
}

export async function isRateLimited(username: string): Promise<boolean> {
  const recentAttempts = await storage.getRecentLoginAttempts(
    username,
    ATTEMPT_WINDOW_MINUTES
  );
  
  const failedAttempts = recentAttempts.filter(attempt => !attempt.successful);
  return failedAttempts.length >= MAX_LOGIN_ATTEMPTS;
}

export async function validateCredentials(
  username: string,
  password: string,
  ipAddress?: string
): Promise<{ valid: boolean; message?: string }> {
  if (await isRateLimited(username)) {
    await storage.recordLoginAttempt({
      username,
      ipAddress,
      successful: false,
    });
    return {
      valid: false,
      message: `Too many failed login attempts. Please try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
    };
  }

  const adminUser = await storage.getAdminUserByUsername(username);
  
  if (!adminUser) {
    await storage.recordLoginAttempt({
      username,
      ipAddress,
      successful: false,
    });
    return { valid: false, message: "Invalid credentials" };
  }

  if (!adminUser.isActive) {
    await storage.recordLoginAttempt({
      username,
      ipAddress,
      successful: false,
    });
    return { valid: false, message: "Account is inactive" };
  }

  const isValid = await bcrypt.compare(password, adminUser.passwordHash);
  
  await storage.recordLoginAttempt({
    username,
    ipAddress,
    successful: isValid,
  });

  if (isValid) {
    await storage.updateAdminLastLogin(username);
    return { valid: true };
  }

  return { valid: false, message: "Invalid credentials" };
}

export { jwtRequireAuth as requireAuth };

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return bcrypt.hash(password, saltRounds);
}
