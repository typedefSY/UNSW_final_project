"use client";

import { Course } from "@/backend";
import { CoursesContainer } from "@/components/dashboard/Courses";
import { CreateCourseButton } from "@/components/dashboard/CreateCoursePopup";
import { JoinCourseButton } from "@/components/dashboard/JoinCoursePopup";
import { CenteredLoading } from "@/components/loading";
import { PageFrame } from "@/components/structural/PageFrame";
import { useBackend } from "@/hooks/useBackend";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CoursePage = () => {
  const [coursesTeaching, setCoursesTeaching] = useState<Course[]>([]);
  const [coursesLearning, setCoursesLearning] = useState<Course[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const backend = useBackend();

  useEffect(() => {
    setIsLoading(true);
    const fetchCourses = async () => {
      const { courses, memberships } = await backend.getUserCourses({});

      const teaching = courses.filter((c) =>
        memberships.find((m) => m.courseId === c.id && m.role === "TEACHER"),
      );

      const learning = courses.filter((c) =>
        memberships.find((m) => m.courseId === c.id && m.role === "STUDENT"),
      );

      setCoursesTeaching(teaching);
      setCoursesLearning(learning);
      setIsLoading(false);
    };
    void fetchCourses();
  }, [backend]);

  const router = useRouter();

  const onClickCourse = useCallback(
    (course: Course) => {
      router.push(`/course/${course.id}`);
    },
    [router],
  );

  if (isLoading) {
    return (
      <PageFrame title="My Courses">
        <CenteredLoading />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      title="My Courses"
      right={
        <div className="flex space-x-2 justify-end">
          <CreateCourseButton />
          <JoinCourseButton />
        </div>
      }
    >
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-bold">Learning</div>
          <CoursesContainer
            courses={coursesLearning}
            onClickCourse={onClickCourse}
          ></CoursesContainer>
          {coursesLearning.length === 0 && (
            <div className="text-gray-500">
              You are not enrolled in any courses
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="text-lg font-bold">Teaching</div>
          <CoursesContainer
            courses={coursesTeaching}
            onClickCourse={onClickCourse}
          ></CoursesContainer>
          {coursesTeaching.length === 0 && (
            <div className="text-gray-500">
              You are not teaching any courses
            </div>
          )}
        </div>
      </div>
    </PageFrame>
  );
};

export default CoursePage;
