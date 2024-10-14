import { Post, PostStats, ThreadStats } from "@/backend";
import AdvancedEditor from "../editor/AdvancedEditor";
import { Avatar } from "@radix-ui/themes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCallback, useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { JSONContent } from "novel";

dayjs.extend(relativeTime);

export const PostDisplay: React.FC<{
  post: Post;
  onClickDelete?: (post: Post) => void;
  onClickLike?: (post: Post) => void;
  onEditCommitted?: (post: Post) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  // Whether the post is being displayed as the content of the thread
  asThreadContent?: boolean;
  threadStats?: ThreadStats;
  postStats?: PostStats;
}> = ({
  post,
  onClickLike,
  asThreadContent = false,
  threadStats,
  postStats,
  canEdit,
  canDelete,
  onClickDelete,
  onEditCommitted,
}) => {
  const onClickLikeInner = useCallback(() => {
    onClickLike?.(post);
  }, [onClickLike, post]);

  const [isEditing, setIsEditing] = useState(false);

  const [currentContent, setCurrentContent] = useState<JSONContent | null>(
    post.content,
  );

  useEffect(() => {
    setCurrentContent(post.content);
  }, [post.content]);

  const onClickEditInner = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onClickSaveInner = useCallback(() => {
    setIsEditing(false);
    onEditCommitted?.({ ...post, content: currentContent });
  }, [currentContent, onEditCommitted, post]);

  const onClickDeleteInner = useCallback(() => {
    onClickDelete?.(post);
  }, [onClickDelete, post]);

  return (
    <div
      className={`flex flex-col space-y-4 ${
        asThreadContent ? "" : "p-4 border-gray-300 border rounded-md "
      }`}
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Avatar
            src={post.createdBy?.avatar}
            fallback={post.createdBy?.firstName[0] ?? "?"}
          />
          <div className="flex flex-col">
            <div>
              {post.createdBy
                ? `${post.createdBy.firstName} ${post.createdBy.lastName}`
                : "Anonymous"}
            </div>
            <div className="text-sm font-gray-600">
              {dayjs(post.createdAt).fromNow()}
            </div>
          </div>
        </div>
        {asThreadContent && threadStats && (
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className="text-xl">{threadStats.views}</div>
              <div className="text-xs">VIEWS</div>
            </div>
          </div>
        )}
      </div>

      <AdvancedEditor
        value={currentContent ?? undefined}
        setValue={setCurrentContent}
        isEditable={isEditing}
        className={isEditing ? "px-4 py-2 border border-muted rounded-md" : ""}
      />

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <div onClick={onClickLikeInner} className="cursor-pointer">
            {postStats?.liked ? <IoHeart /> : <IoIosHeartEmpty />}
          </div>

          <div className="text-xs text-center">{postStats?.likes ?? 0}</div>
        </div>
        {canEdit && (
          <>
            {isEditing ? (
              <div
                className="flex items-center text-sm cursor-pointer"
                onClick={onClickSaveInner}
              >
                <div>Save</div>
              </div>
            ) : (
              <div
                className="flex items-center text-sm cursor-pointer"
                onClick={onClickEditInner}
              >
                <div>Edit</div>
              </div>
            )}
          </>
        )}
        {canDelete && (
          <div
            className="flex items-center text-sm cursor-pointer"
            onClick={onClickDeleteInner}
          >
            <div>Delete</div>
          </div>
        )}
      </div>
    </div>
  );
};
