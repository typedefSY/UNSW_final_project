import { User } from "@prisma/client";
import { db } from "@/globals";
import { makeID } from "./utils";
import { sendEmailFromTemplate } from "./mailer";
import { APIError } from "@/apis";
import bcrypt from "bcryptjs";
import { registrationEmail } from "@/mailerTemplates/registration";
import { forgotPasswordEmail } from "@/mailerTemplates/forgotPassword";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const getUsersByIDs = async (ids: string[]): Promise<User[]> => {
  const user = await db.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return user;
};

export const getUserInfoByID = async (id: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  return !!user;
};

export const isCanResetPassword = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new APIError("Account not found");
  }
  return true;
};

export const generateAndSendOTP = async (email: string): Promise<string> => {
  const code = makeID(6);

  await db.emailVerification.create({
    data: {
      email,
      verification: code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  await sendEmailFromTemplate(email, registrationEmail, {
    code: code,
    email: email,
  });

  return code;
};

export const generateAndSendForgotPasswordOTP = async (
  email: string,
): Promise<string> => {
  const code = makeID(6);

  await db.emailVerification.create({
    data: {
      email,
      verification: code,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    },
  });

  const user = (await getUserByEmail(email))!;

  await sendEmailFromTemplate(email, forgotPasswordEmail, {
    code: code,
    email: email,
    firstName: user.firstName,
  });

  return code;
};

export const verifyOTP = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const verification = await db.emailVerification.findFirst({
    where: {
      email,
      verification: code,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!verification) {
    throw new APIError("Invalid verification code");
  }

  await db.emailVerification.delete({
    where: {
      id: verification.id,
    },
  });

  return true;
};

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 3);
};

interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const createUser = async (req: CreateUserRequest): Promise<User> => {
  if (await isEmailTaken(req.email)) {
    throw new APIError("Email already taken");
  }

  const { email, firstName, lastName, password } = req;

  if (!email || !firstName || !lastName || !password) {
    throw new APIError("You need to fill in all fields.");
  }

  const user = await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashPassword(password),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return user;
};

export const checkPassword = async (
  email: string,
  password: string,
): Promise<User> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new APIError("Invalid email or password");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new APIError("Invalid email or password");
  }

  return user;
};

export const updatePassword = async (
  email: string,
  password: string,
): Promise<void> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new APIError("Account not found");
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashPassword(password),
    },
  });
};

export const generateToken = async (user: User): Promise<string> => {
  const token = makeID(32);
  try {
    await db.token.create({
      data: {
        userID: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });
  } catch (e) {
    console.error("Error creating token", e);
    throw new APIError("Error creating token");
  }
  return token;
};

export const getUserByToken = async (token: string): Promise<User | null> => {
  try {
    const tokenRecord = await db.token.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    });

    if (tokenRecord && tokenRecord.expiresAt > new Date()) {
      return tokenRecord.user;
    }
  } catch (e) {
    console.error("Error getting user by token", e);
  }
  return null;
};
