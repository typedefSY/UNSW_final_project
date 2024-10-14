"use client";

import { Thread } from "@/backend";
import { useCallback } from "react";
import { RiQuestionAnswerLine } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@radix-ui/themes";
import { MdAdd } from "react-icons/md";

dayjs.extend(relativeTime);

interface CardProps {
  thread: Thread;
  isActive?: boolean;
  onClick?: (thread: Thread) => void;
}

export const ThreadCard: React.FC<CardProps> = ({
  thread,
  isActive,
  onClick,
}) => {
  const onClickInner = useCallback(() => {
    onClick?.(thread);
  }, [onClick, thread]);

  const createdByName = `${thread.createdBy?.firstName ?? ""}${
    thread.createdBy?.lastName ? " " + thread.createdBy.lastName : ""
  }`;

  return (
    <div
      className={`flex flex-col px-4 rounded-l rounded-r ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      } py-3 border-gray-300 select-none ${
        onClick ? "cursor-pointer" : ""
      } space-y-2`}
      onClick={onClickInner}
    >
      {thread.isAnnouncement && (
        <div className="text-xs uppercase text-red-800">Announcement</div>
      )}
      <div className="flex space-x-3 items-center">
        <RiQuestionAnswerLine />
        <div className="text-wrap">{thread.title}</div>
      </div>
      <div className="flex text-xs justify-between">
        <div>{createdByName || "Anonymous"}</div>
        <div>{dayjs(thread.createdAt).fromNow()}</div>
      </div>
    </div>
  );
};

interface ListProps {
  activeThreadId: string | null;
  threads: Thread[];
  className?: string;
  onClickThread?: (thread: Thread) => void;
  onClickNewThread?: () => void;
}

export const ThreadList: React.FC<ListProps> = ({
  activeThreadId,
  threads,
  className,
  onClickThread,
  onClickNewThread,
}) => {
  return (
    <div
      className={`overflow-x-hidden overflow-y-auto ${
        className ?? ""
      } flex flex-col space-y-4`}
    >
      {onClickNewThread && (
        <div className="px-2 w-full flex">
          <Button
            variant="surface"
            className="flex-1"
            onClick={onClickNewThread}
          >
            <MdAdd></MdAdd> New Thread
          </Button>
        </div>
      )}
      <div className="flex flex-col overflow-y-auto">
        {threads.map((thread) => (
          <div className="border-t first:border-t-0 py-1 px-1" key={thread.id}>
            <ThreadCard
              thread={thread}
              isActive={activeThreadId === thread.id}
              onClick={onClickThread}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
