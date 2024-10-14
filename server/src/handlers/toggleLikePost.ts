import {
  getPostByID,
  getPostsReactions,
  toggleLikePost as toggleLikePostDB,
} from "@/data/forum";
import {
  APIError,
  ToggleLikePostRequest,
  ToggleLikePostResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { canViewPost } from "@/data/permissions";

export const kPostAccessDenied =
  "Post not found, or you are not authorized to access it.";

// toggleLikePost implements the toggleLikePost endpoint.
export const toggleLikePost = async (
  ctx: any,
  { postID }: ToggleLikePostRequest,
): Promise<ToggleLikePostResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!(await canViewPost(user, postID))) {
    throw new APIError(kPostAccessDenied);
  }

  await toggleLikePostDB(postID, user.id);

  return {};
};
