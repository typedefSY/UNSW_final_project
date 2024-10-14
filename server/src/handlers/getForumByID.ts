import { APIError, GetForumByIDRequest, GetForumByIDResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getForumByID as getForumByIDDB } from "@/data/forum";
import { canViewForum } from "@/data/permissions";
import { kForumNotFoundOrDeniedError } from "./getForumByCourseID";
import { forumDBToAPIWithCreatedBy } from "@/converts/forum";

// getForumByID implements the getForumByID endpoint.
export const getForumByID = async (
  ctx: any,
  request: GetForumByIDRequest,
): Promise<GetForumByIDResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!(await canViewForum(user, request.id))) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  const forum = await getForumByIDDB(request.id);

  if (!forum) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  return {
    forum: forumDBToAPIWithCreatedBy(forum),
  };
};
