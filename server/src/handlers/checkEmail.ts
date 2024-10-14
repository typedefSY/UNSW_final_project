import { CheckEmailRequest, CheckEmailResponse } from "@/apis";
import { isEmailTaken } from "@/data/auth";

// checkEmail implements the checkEmail endpoint.
export const checkEmail = async (
  ctx: any,
  request: CheckEmailRequest,
): Promise<CheckEmailResponse> => {
  return {
    taken: await isEmailTaken(request.email),
  };
};
