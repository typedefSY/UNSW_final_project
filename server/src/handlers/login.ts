import { LoginRequest, LoginResponse } from "@/apis";
import { userDBToAPI } from "@/converts/user";
import { checkPassword, generateToken } from "@/data/auth";

// login implements the login endpoint.
export const login = async (
  ctx: any,
  request: LoginRequest,
): Promise<LoginResponse> => {
  const user = await checkPassword(request.email, request.password);
  const token = await generateToken(user);
  return {
    user: userDBToAPI(user),
    token,
  };
};
