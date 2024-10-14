import {
  APIError,
  GetThreadAndPostStatsRequest,
  GetThreadAndPostStatsResponse,
  PostStats,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import {
  getPostIDsByThreadID,
  getPostsReactions,
  getThreadViews,
} from "@/data/forum";
import { canViewThread } from "@/data/permissions";

// getThreadAndPostStats implements the getThreadAndPostStats endpoint.
export const getThreadAndPostStats = async (
  ctx: any,
  { threadID }: GetThreadAndPostStatsRequest,
): Promise<GetThreadAndPostStatsResponse> => {
  const user = await useCurrentUser(ctx)!;

  if (!(await canViewThread(user, threadID))) {
    throw new APIError(
      "Thread not found, or you are not authorized to access it.",
    );
  }

  const views = await getThreadViews(threadID);

  const childrenPosts = await getPostIDsByThreadID(threadID);

  const likes = await getPostsReactions(childrenPosts);

  const reactions: Record<string, PostStats> = {};

  childrenPosts.forEach((postID) => {
    reactions[postID] = {
      liked: false,
      likes: 0,
      postID: postID,
    };
  });

  likes.forEach((like) => {
    reactions[like.postID]!.likes++;

    if (like.userID === user.id) {
      reactions[like.postID]!.liked = true;
    }
  });

  return {
    thread: {
      views: views.length,
      threadID,
    },
    posts: reactions,
  };
};
