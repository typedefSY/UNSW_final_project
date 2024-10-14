import { isExpressRequestContext } from "@/middlewares/authenticator";
import { User } from "@prisma/client";

export const useCurrentUser = (ctx: any): User | null => {
  if (!ctx) return null;

  const req = ctx.req;

  if (!(req instanceof Object)) return null;

  const contextField = req.context;

  if (!(contextField instanceof Object)) return null;

  if (isExpressRequestContext(contextField)) {
    return contextField.user ?? null;
  }

  return null;
};
