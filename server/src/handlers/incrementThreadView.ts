import {
  APIError,
  IncrementThreadViewRequest,
  IncrementThreadViewResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { incrementView } from "@/data/forum";
import { canViewThread } from "@/data/permissions";

// incrementThreadView implements the incrementThreadView endpoint.
export const incrementThreadView = async (
  ctx: any,
  { threadID }: IncrementThreadViewRequest,
): Promise<IncrementThreadViewResponse> => {
  const user = await useCurrentUser(ctx)!;

  if (!(await canViewThread(user, threadID))) {
    throw new APIError(
      "Thread not found, or you are not authorized to access it.",
    );
  }

  await incrementView(threadID, user.id!);

  return {};
};
