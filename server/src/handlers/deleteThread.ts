import { DeleteThreadRequest, DeleteThreadResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { canModifyThread } from "@/data/permissions";
import { deleteThread as deleteThreadDB } from "@/data/forum";

// deleteThread implements the deleteThread endpoint.
export const deleteThread = async (
  ctx: any,
  request: DeleteThreadRequest,
): Promise<DeleteThreadResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!(await canModifyThread(user, request.threadID))) {
    throw new Error("You are not authorized to delete this thread.");
  }

  await deleteThreadDB(request.threadID);

  return {};
};
