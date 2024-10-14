import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/apis";
import { updatePassword, verifyOTP } from "@/data/auth";

// forgotPassword implements the forgotPassword endpoint.
export const forgotPassword = async (
  ctx: any,
  request: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  let { email, newPassword, otp } = request;
  if (await verifyOTP(email, otp)) {
    await updatePassword(email, newPassword);
  }
  return {};
};
