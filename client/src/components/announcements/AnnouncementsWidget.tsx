import { Course, Thread } from "@/backend";
import { Card } from "@radix-ui/themes";
import { useCallback, useEffect, useReducer } from "react";
import { initialState, reducer } from "./AnnouncementsWidget.reducer";
import { useBackend } from "@/hooks/useBackend";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface AnnouncementDisplayProps {
  thread: Thread;
  course: Course;
  onClickThread: (thread: Thread) => void;
}

export const AnnouncementDisplay: React.FC<AnnouncementDisplayProps> = ({
  onClickThread,
  thread,
  course,
}) => {
  const onClick = useCallback(() => {
    onClickThread(thread);
  }, [onClickThread, thread]);

  return (
    <div
      className="overflow-hidden first:border-t-0 border-t"
      onClick={onClick}
    >
      <div className="select-none cursor-pointer hover:bg-gray-200 px-2 py-3 rounded-md">
        <div className="flex flex-col">
          <div className="flex space-x-2">
            <div className="font-bold">{thread.title}</div>
          </div>
          <div className="text-xs text-gray-500"></div>
          <div className="text-xs text-gray-500">
            {course.name}, {dayjs(thread.createdAt).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatefulAnnouncementsWidget: React.FC<{
  courseID?: string;
  className?: string;
}> = ({ courseID, className }) => {
  const [s, dispatch] = useReducer(reducer, initialState());
  const backend = useBackend();

  useEffect(() => {
    const inner = async () => {
      dispatch({ type: "set-loading", isLoading: true });
      const { threads, threadToCourse } = await backend.getAnnouncements({
        courseIDs: courseID ? [courseID] : undefined,
      });

      dispatch({ type: "load-threads", threads });
      dispatch({ type: "load-courses", courses: threadToCourse });
      dispatch({ type: "set-loading", isLoading: false });
    };

    void inner();
  }, [backend, courseID]);

  const router = useRouter();

  const onClickThread = useCallback(
    (thread: Thread) => {
      router.push(
        `/course/${s.courses[thread.id]!.id}/forum?thread=${thread.id}`,
      );
    },
    [router, s.courses],
  );

  return (
    <Card className={`flex flex-col ${className ?? ""}`}>
      {s.isLoading || !s.courses || !s.threads
        ? "Loading..."
        : s.threads.map((thread) => (
            <AnnouncementDisplay
              key={thread.id}
              thread={thread}
              course={s.courses[thread.id]!}
              onClickThread={onClickThread}
            />
          ))}

      {!s.isLoading && s.threads.length === 0 && (
        <div className="text-gray-500 text-xs text-center py-4">
          You are all caught up! There are no announcements.
        </div>
      )}
    </Card>
  );
};
