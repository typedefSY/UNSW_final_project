import { getUserByToken } from "@/data/auth";
import { User } from "@prisma/client";
import { RequestHandler } from "express";

export interface ExpressRequestContext {
  user?: User;
  token?: string;
}

export const isExpressRequestContext = (
  ctx: any,
): ctx is ExpressRequestContext => {
  if (!(ctx instanceof Object)) {
    return false;
  }

  return true;
};

declare global {
  namespace Express {
    interface Request {
      context: ExpressRequestContext;
    }
  }
}

export const authenticator = (
  publicEndpoints: string[] = [],
): RequestHandler => {
  const mw: RequestHandler = async (req, res, next) => {
    console.log("Requesting", req.path);
    if (publicEndpoints.includes(req.path)) {
      next();
      return;
    }

    const token = req.cookies.token;
    req.context = { token };

    if (!token) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const user = await getUserByToken(token);

    if (user !== null) {
      req.context = { ...req.context, user };
    } else {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    next();
  };
  return mw;
};
