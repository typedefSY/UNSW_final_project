import { User as UserAPI } from "@/apis";
import { User as UserDB } from "@prisma/client";

export const userDBToAPI = (user: UserDB): UserAPI => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar ? user.avatar : undefined,
    gender: user.gender ? user.gender : undefined,
    title: user.title ? user.title : undefined,
    bio: user.bio ? user.bio : undefined,
  };
};
