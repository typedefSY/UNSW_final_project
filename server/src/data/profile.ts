import { User as UserDB } from "@prisma/client";
import { User as UserAPI } from "@/apis";
import { db } from "@/globals";
import { APIError } from "@/apis";

export const updateUserProfile = async (user: UserAPI): Promise<void> => {
  const { email, ...rest } = user;
  if (Object.keys(rest).length === 0) {
    throw new APIError("No fields to update");
  }
  await db.user.update({
    where: { email },
    data: rest,
  });
};
