import { Post, PostStats, Thread, ThreadStats } from "@/backend";
import { Badge, Button } from "@radix-ui/themes";
import { JSONContent } from "novel";
import { useCallback, useState } from "react";
import { AdvancedEditor } from "../editor/AdvancedEditor";
import { PostDisplay } from "./PostDisplay";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  onDeletePost: (post: Post) => void;
  onDeleteThread: (thread: Thread) => void;
  onUpsertPost: (post: Post) => void;
  onUpsertThread: (thread: Thread) => void;
  thread: Thread;

  onToggleLike: (post: Post) => void;

  threadStats?: ThreadStats;
  postStats?: Record<string, PostStats>;
}

export const ThreadDisplay: React.FC<Props> = ({
  thread,
  onUpsertPost,
  postStats,
  threadStats,
  onToggleLike,
  onDeletePost,
}) => {
  const [draftContent, setDraftContent] = useState<JSONContent>({
    type: "doc",
    content: [],
  });

  const onClickPost = useCallback(() => {
    if (!draftContent.content || draftContent.content.length === 0) return;

    onUpsertPost({
      content: draftContent,
      createdAt: 0,
      id: "",
      threadID: thread.id,
      updatedAt: 0,
    });

    setDraftContent({ type: "doc", content: [] });
  }, [draftContent, onUpsertPost, thread.id]);

  const onDeletePostInner = useCallback(
    (post: Post) => {
      onDeletePost(post);
    },
    [onDeletePost],
  );

  const user = useCurrentUser();

  return (
    <div className="flex flex-col px-4 py-4 space-y-4">
      <div className="mb-4 flex items-center space-x-4">
        <div className="text-4xl">{thread.title}</div>
        {thread.isAnnouncement && <Badge size="3">Announcement</Badge>}
      </div>

      {thread.posts.map((post, idx) => (
        <PostDisplay
          post={post}
          key={post.id}
          asThreadContent={idx === 0}
          postStats={postStats?.[post.id] ?? undefined}
          threadStats={threadStats}
          onClickLike={onToggleLike}
          canDelete={post.createdBy?.id === user?.id}
          canEdit={post.createdBy?.id === user?.id}
          onClickDelete={onDeletePostInner}
          onEditCommitted={onUpsertPost}
        />
      ))}

      <div className="text-2xl mt-12">Reply</div>

      <AdvancedEditor
        className="border rounded-md overflow-y-auto overflow-x-hidden max-h-[50vh] border-gray-300 p-12 px-8 sm:px-12"
        value={draftContent}
        setValue={setDraftContent}
      />

      <div className="flex justify-end space-x-2">
        <Button onClick={onClickPost} variant="solid">
          Post
        </Button>
      </div>
    </div>
  );
};
