import { ResetPasswordRequest, ResetPasswordResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { checkPassword, updatePassword } from "@/data/auth";

// resetPassword implements the resetPassword endpoint.
export const resetPassword = async (
  ctx: any,
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  let user = useCurrentUser(ctx)!;
  let { password, newPassword } = request;
  await checkPassword(user.email, password);
  await updatePassword(user.email, newPassword);
  return {};
};
