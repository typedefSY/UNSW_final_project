import {
  APIError,
  SetUserProfileRequest,
  SetUserProfileResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getUserByToken } from "@/data/auth";
import { updateUserProfile } from "@/data/profile";

// setUserProfile implements the setUserProfile endpoint.
export const setUserProfile = async (
  ctx: any,
  request: SetUserProfileRequest,
): Promise<SetUserProfileResponse> => {
  let askUser = useCurrentUser(ctx);

  let { user } = request;
  if (askUser!.email !== user.email) {
    throw new APIError("No permission to update other user's profile");
  }
  await updateUserProfile(user);
  return {};
};
