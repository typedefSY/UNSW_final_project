import { APIError, DeletePostRequest, DeletePostResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { canModifyPost } from "@/data/permissions";
import {
  deletePost as deletePostDB,
  deleteThread,
  getPostByID,
  getThreadByID,
} from "@/data/forum";

// deletePost implements the deletePost endpoint.
export const deletePost = async (
  ctx: any,
  request: DeletePostRequest,
): Promise<DeletePostResponse> => {
  const user = useCurrentUser(ctx);

  if (!user) {
    throw new APIError("You are not authorized to delete this post.");
  }

  if (!(await canModifyPost(user, request.postID))) {
    throw new APIError("You are not authorized to delete this post.");
  }

  const post = await getPostByID(request.postID);

  if (!post) {
    throw new APIError("Post not found");
  }

  const thread = await getThreadByID(post.threadID);

  if (!thread) {
    throw new APIError("Thread not found");
  }

  await deletePostDB(post.id);

  if (thread.posts.findIndex((p) => p.id === post.id) === 0) {
    await deleteThread(thread.id);
  }

  return {};
};
