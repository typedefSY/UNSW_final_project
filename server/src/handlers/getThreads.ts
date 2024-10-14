import { APIError, GetThreadsRequest, GetThreadsResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { isMemberOfCourse } from "@/data/course";
import { getForumByID, getThreadsByForumID } from "@/data/forum";
import { kForumNotFoundOrDeniedError } from "./getForumByCourseID";
import { threadWithPostsDBToAPI } from "@/converts/forum";

// getThreads implements the getThreads endpoint.
export const getThreads = async (
  ctx: any,
  { forumID }: GetThreadsRequest,
): Promise<GetThreadsResponse> => {
  const user = useCurrentUser(ctx)!;

  const forum = await getForumByID(forumID);

  if (!forum) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  if (!(await isMemberOfCourse(user.id!, forum.courseID))) {
    throw new APIError(kForumNotFoundOrDeniedError);
  }

  const threads = await getThreadsByForumID(forumID, user.id);

  const threadAPIs = threads.map((t) => threadWithPostsDBToAPI(t));

  return {
    threads: threadAPIs,
  };
};
