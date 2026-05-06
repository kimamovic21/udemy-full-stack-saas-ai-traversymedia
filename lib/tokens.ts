import { randomBytes } from "crypto";
import { prisma } from "./prisma";

const TOKEN_EXPIRY_HOURS = 24;

export async function generateVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken.token;
}

export async function getVerificationToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  return verificationToken;
}

export async function deleteVerificationToken(token: string) {
  await prisma.verificationToken.delete({
    where: { token },
  });
}
