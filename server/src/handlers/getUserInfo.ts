import { GetUserInfoRequest, GetUserInfoResponse } from "@/apis";
import { userDBToAPI } from "@/converts/user";
import { useCurrentUser } from "@/context/auth";

// getUserInfo implements the getUserInfo endpoint.
export const getUserInfo = async (
  ctx: any,
  request: GetUserInfoRequest,
): Promise<GetUserInfoResponse> => {
  const user = useCurrentUser(ctx);
  console.log((ctx as any).req.context);
  // The request is authenticated, so we can trust the user object.
  return { user: userDBToAPI(user!) };
};
