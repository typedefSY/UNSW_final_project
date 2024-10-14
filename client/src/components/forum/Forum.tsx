"use client";

import {
  Thread,
  Forum as ForumType,
  Post,
  ThreadStats,
  PostStats,
} from "@/backend";
import { ThreadList } from "./ThreadList";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { CenteredLoading } from "../loading";
import { useBackend } from "@/hooks/useBackend";
import { initialState, reducer } from "./Forum.reducer";
import { NewThreadDisplay, ThreadAttributes } from "./NewThreadDisplay";
import { ThreadDisplay } from "./ThreadDisplay";
import { JSONContent } from "novel";

interface Props {
  forum: ForumType;
  threads: Thread[];

  activeThreadId: string | null;
  activeThreadStats?: ThreadStats;
  activePostStats?: Record<string, PostStats>;

  onCreateThreadAndPost: (
    title: string,
    content: JSONContent,
    attrs: ThreadAttributes,
  ) => void;
  onClickCancelNewThread: () => void;

  onClickThread: (thread: Thread | null) => void;
  onUpsertThread: (thread: Thread) => void;
  onDeleteThread: (thread: Thread) => void;
  onUpsertPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  onClickNewThread: () => void;
  isCreatingNewThread: boolean;
  isLoading: boolean;

  onToggleLike: (post: Post) => void;
}

export const Forum: React.FC<Props> = ({
  forum,
  threads,
  activeThreadId,
  onClickThread,
  onDeletePost,
  onDeleteThread,
  onUpsertPost,
  onUpsertThread,
  onClickNewThread,
  onClickCancelNewThread: onCancelNewThread,
  onCreateThreadAndPost,
  isCreatingNewThread,
  activePostStats,
  activeThreadStats,
  isLoading,
  onToggleLike,
}) => {
  const onClickCancelNewThread = useCallback(() => {
    onCancelNewThread();
  }, [onCancelNewThread]);

  const getDisplay = () => {
    if (isCreatingNewThread) {
      return (
        <NewThreadDisplay
          onClickCreateThreadAndPost={onCreateThreadAndPost}
          onClickCancel={onClickCancelNewThread}
        />
      );
    } else if (activeThreadId) {
      const thread = threads.find((t) => t.id === activeThreadId)!;

      if (!thread) {
        return <div />;
      }

      return (
        <ThreadDisplay
          onDeletePost={onDeletePost}
          onDeleteThread={onDeleteThread}
          onUpsertPost={onUpsertPost}
          onUpsertThread={onUpsertThread}
          thread={thread}
          postStats={activePostStats}
          threadStats={activeThreadStats}
          onToggleLike={onToggleLike}
        />
      );
    } else {
      return <div />;
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ThreadList
        activeThreadId={activeThreadId}
        threads={threads}
        className="w-1/5 min-w-48 border-r border-gray-300 h-full sticky py-4"
        onClickThread={onClickThread}
        onClickNewThread={onClickNewThread}
      />
      <div className="flex-1 h-full overflow-y-auto">{getDisplay()}</div>
      {/* {isLoading && (
        <div className="h-2 w-screen fixed left-0 top-0 z-50">
          <div className="h-full bg-green-100 animate-pulse" />
        </div>
      )} */}
    </div>
  );
};

interface StatefulProps {
  forumId: string;
  activeThreadId: string | null;
  onChangeActiveThreadId: (threadId: string | null) => void;
}

export const StatefulForum: React.FC<StatefulProps> = ({
  forumId,
  onChangeActiveThreadId,
  activeThreadId,
}) => {
  const [s, dispatch] = useReducer(reducer, initialState());

  const backend = useBackend();

  const onClickThread = useCallback(
    (t: Thread | null) => {
      onChangeActiveThreadId(t?.id ?? null);
    },
    [onChangeActiveThreadId],
  );

  const reloadThreadStats = useCallback(async () => {
    if (activeThreadIdRef.current === null) {
      return;
    }

    dispatch({ type: "set-loading", isLoading: true });

    const { thread, posts } = await backend.getThreadAndPostStats({
      threadID: activeThreadIdRef.current,
    });

    dispatch({
      type: "load-thread-stats",
      threadStats: thread,
      postStats: posts,
    });
    dispatch({ type: "set-loading", isLoading: false });
  }, [backend]);

  const reloadThreads = useCallback(async () => {
    dispatch({ type: "set-loading", isLoading: true });

    const { threads } = await backend.getThreads({
      forumID: forumId,
    });

    dispatch({ type: "load-threads", threads });

    void reloadThreadStats();
  }, [backend, forumId, reloadThreadStats]);

  const activeThreadIdRef = useRef(activeThreadId);

  useEffect(() => {
    if (activeThreadIdRef.current !== activeThreadId) {
      activeThreadIdRef.current = activeThreadId;
    }

    const actID = activeThreadIdRef.current;

    if (actID !== null) {
      void backend.incrementThreadView({ threadID: actID });
    }
  }, [activeThreadId, backend]);

  const onCreateThreadAndPost = useCallback(
    async (title: string, content: JSONContent, attrs: ThreadAttributes) => {
      onChangeActiveThreadId(null);

      const { thread } = await backend.upsertThread({
        thread: {
          createdAt: 0,
          forumID: forumId,
          id: "",
          posts: [],
          title,
          updatedAt: 0,
          isAnnouncement: attrs.isAnnouncement,
        },
      });

      await backend.upsertPost({
        post: {
          content,
          createdAt: 0,
          id: "",
          threadID: thread.id,
          updatedAt: 0,
        },
      });

      await reloadThreads();

      onChangeActiveThreadId(thread.id);
    },
    [backend, forumId, onChangeActiveThreadId, reloadThreads],
  );

  const onUpsertThread = useCallback(
    async (t: Thread) => {
      await backend.upsertThread({
        thread: t,
      });

      await reloadThreads();
    },
    [backend, reloadThreads],
  );

  const onDeleteThread = useCallback(
    async (t: Thread) => {
      await backend.deleteThread({
        threadID: t.id,
      });

      await reloadThreads();
    },
    [backend, reloadThreads],
  );

  const onUpsertPost = useCallback(
    async (p: Post) => {
      await backend.upsertPost({
        post: p,
      });

      await reloadThreads();
    },
    [backend, reloadThreads],
  );

  const onDeletePost = useCallback(
    async (p: Post) => {
      await backend.deletePost({
        postID: p.id,
      });

      await reloadThreads();
    },
    [backend, reloadThreads],
  );

  useEffect(() => {
    if (activeThreadId !== null) {
      dispatch({ type: "set-creating-new-thread", isCreatingNewThread: false });
    }

    void reloadThreadStats();
  }, [activeThreadId, reloadThreadStats]);

  const onClickNewThread = useCallback(() => {
    dispatch({ type: "set-creating-new-thread", isCreatingNewThread: true });
    onChangeActiveThreadId(null);
  }, [onChangeActiveThreadId]);

  const onClickCancelNewThread = useCallback(() => {
    dispatch({ type: "set-creating-new-thread", isCreatingNewThread: false });
    onChangeActiveThreadId(null);
  }, [onChangeActiveThreadId]);

  useEffect(() => {
    const inner = async () => {
      const { forum } = await backend.getForumByID({
        id: forumId,
      });

      dispatch({ type: "load-forum", forum });

      await reloadThreads();
    };

    void inner();
  }, [backend, forumId, reloadThreads]);

  const onToggleLike = useCallback(
    async (post: Post) => {
      await backend.toggleLikePost({
        postID: post.id,
      });

      await reloadThreadStats();
    },
    [backend, reloadThreadStats],
  );

  useEffect(() => {
    void reloadThreads();
  }, [reloadThreads]);

  if (!s.forum) {
    return <CenteredLoading />;
  }

  return (
    <Forum
      forum={s.forum}
      threads={s.threads}
      activeThreadId={activeThreadId}
      activePostStats={s.activePostStats}
      activeThreadStats={s.activeThreadStats}
      onClickThread={onClickThread}
      onUpsertThread={onUpsertThread}
      onCreateThreadAndPost={onCreateThreadAndPost}
      onDeleteThread={onDeleteThread}
      onUpsertPost={onUpsertPost}
      onDeletePost={onDeletePost}
      onClickNewThread={onClickNewThread}
      onClickCancelNewThread={onClickCancelNewThread}
      onToggleLike={onToggleLike}
      isCreatingNewThread={s.isCreatingNewThread}
      isLoading={s.isLoading}
    />
  );
};
