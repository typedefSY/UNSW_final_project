import { APIError, VerifyEmailRequest, VerifyEmailResponse } from "@/apis";
import { generateAndSendOTP, isEmailTaken } from "@/data/auth";

// verifyEmail implements the verifyEmail endpoint.
export const verifyEmail = async (
  ctx: any,
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  let { email } = request;

  if (await isEmailTaken(email)) {
    throw new APIError("Email is already taken");
  }

  await generateAndSendOTP(email);
  return {};
};
