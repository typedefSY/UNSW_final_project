"use client";

import { useCourse } from "@/contexts/CourseContext";
import { useCallback, useEffect, useState } from "react";
import { CenteredLoading } from "@/components/loading";
import { useBackend } from "@/hooks/useBackend";
import { StatefulForum } from "@/components/forum/Forum";
import { useRouter, useSearchParams } from "next/navigation";

const ForumPage: React.FC = () => {
  const course = useCourse();

  const [forumId, setForumId] = useState<string | null>(null);

  const backend = useBackend();
  const params = useSearchParams();

  const activeThreadId = params.get("thread");

  useEffect(() => {
    if (course === null) return;

    const inner = async () => {
      const { forum } = await backend.getForumByCourseID({
        courseID: course.id,
      });

      setForumId(forum.id);
    };

    void inner();
  }, [backend, course]);

  const router = useRouter();

  const onChangeActiveThreadId = useCallback(
    (threadId: string | null) => {
      router.push(
        `/course/${course.id}/forum${threadId ? "?thread=" + threadId : ""}`,
      );
    },
    [course.id, router],
  );

  if (forumId === null) return <CenteredLoading />;

  return (
    <div className="flex flex-col space-y-4 h-full">
      <StatefulForum
        forumId={forumId}
        activeThreadId={activeThreadId}
        onChangeActiveThreadId={onChangeActiveThreadId}
      />
    </div>
  );
};

export default ForumPage;
