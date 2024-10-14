import { RegisterRequest, RegisterResponse } from "@/apis";
import { createUser, generateAndSendOTP, verifyOTP } from "@/data/auth";
import { verifyEmail } from "./verifyEmail";

// register implements the register endpoint.
export const register = async (
  ctx: any,
  { email, firstName, lastName, password, otp }: RegisterRequest,
): Promise<RegisterResponse> => {
  if (await verifyOTP(email, otp)) {
    await createUser({ email, firstName, lastName, password });
  }
  return {};
};
