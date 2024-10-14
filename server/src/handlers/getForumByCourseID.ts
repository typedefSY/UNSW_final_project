import {
  APIError,
  GetForumByCourseIDRequest,
  GetForumByCourseIDResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { forumDBToAPIWithCreatedBy } from "@/converts/forum";
import { isMemberOfCourse } from "@/data/course";
import { getForumByCourseID as getForumByCourseIDDB } from "@/data/forum";

export const kForumNotFoundOrDeniedError =
  "Forum not found, or you are not authorized to access it.";

// getForumByCourseID implements the getForumByCourseID endpoint.
export const getForumByCourseID = async (
  ctx: any,
  { courseID }: GetForumByCourseIDRequest,
): Promise<GetForumByCourseIDResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!(await isMemberOfCourse(user.id!, courseID))) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  const forum = await getForumByCourseIDDB(courseID);

  if (!forum) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  return {
    forum: forumDBToAPIWithCreatedBy(forum),
  };
};
