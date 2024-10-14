import { createThread, getThreadByID, updateThread } from "@/data/forum";
import { APIError, UpsertThreadRequest, UpsertThreadResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import {
  canCreateThreadInForum,
  canModifyThread,
  canPublishAnnouncement,
} from "@/data/permissions";
import { threadWithPostsDBToAPI } from "@/converts/forum";
import { kForumNotFoundOrDeniedError } from "./getForumByCourseID";
import { getRoleInCourse } from "@/data/course";

export const kThreadNotFoundOrDeniedError =
  "Forum not found, or you are not authorized to access it.";

// upsertThread implements the upsertThread endpoint.
export const upsertThread = async (
  ctx: any,
  { thread }: UpsertThreadRequest,
): Promise<UpsertThreadResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!thread) {
    throw new APIError("missing thread");
  }

  if (thread.forumID === undefined) {
    throw new APIError("a thread must have a forumID");
  }

  let threadID = thread.id;

  if (thread.id) {
    if (!(await canModifyThread(user, thread.id))) {
      throw new APIError(kThreadNotFoundOrDeniedError);
    }

    await updateThread(thread.id, {
      title: thread.title,
    });
  } else {
    if (!(await canCreateThreadInForum(user, thread.forumID))) {
      throw new APIError(kForumNotFoundOrDeniedError);
    }

    if (
      thread.isAnnouncement &&
      !(await canPublishAnnouncement(user, thread.forumID))
    ) {
      throw new APIError(
        "Only teachers can publish announcements in this forum.",
      );
    }

    const { id } = await createThread({
      createdByID: user.id,
      forumID: thread.forumID,
      title: thread.title,
      isAnnouncement: thread.isAnnouncement,
    });

    threadID = id;
  }

  return {
    thread: threadWithPostsDBToAPI((await getThreadByID(threadID))!),
  };
};
