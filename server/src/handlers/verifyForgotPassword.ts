import {
  VerifyForgotPasswordRequest,
  VerifyForgotPasswordResponse,
} from "@/apis";
import {
  generateAndSendForgotPasswordOTP,
  generateAndSendOTP,
  isCanResetPassword,
} from "@/data/auth";

// verifyForgotPassword implements the verifyForgotPassword endpoint.
export const verifyForgotPassword = async (
  ctx: any,
  request: VerifyForgotPasswordRequest,
): Promise<VerifyForgotPasswordResponse> => {
  let { email } = request;
  await isCanResetPassword(email);

  await generateAndSendForgotPasswordOTP(email);
  return {};
};
