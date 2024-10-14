"use client";

import { APIError, Course } from "@/backend";
import { CenteredLoading } from "@/components/loading";
import { PageFrame } from "@/components/structural/PageFrame";
import { CourseContext } from "@/contexts/CourseContext";
import { CourseRoleContext } from "@/contexts/CourseRoleContext";
import { useBackend } from "@/hooks/useBackend";
import { useCallback, useEffect, useState } from "react";

import { Props as FrameProps } from "@/components/structural/PageFrame";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { IoArrowBackSharp } from "react-icons/io5";

interface ApplicationState {
  regex: RegExp;
  frameProps: Exclude<FrameProps, "children">;
}

const mapApplicationState: (course: Course, url: string) => ApplicationState = (
  course: Course,
  url: string,
) => {
  const state: ApplicationState[] = [
    {
      regex: /\/forum$/g,
      frameProps: {
        title: `Forum - ${course.name}`,
        standardWidth: false,
        padding: false,
        singlePageApplication: true,
      },
    },
    {
      regex: /\/members$/g,
      frameProps: {
        title: `Members - ${course.name}`,
        standardWidth: true,
        padding: true,
      },
    },
    {
      regex: /\/books$/g,
      frameProps: {
        title: `Course Books - ${course.name}`,
        standardWidth: true,
        padding: true,
      },
    },
    {
      regex: /.*/g,
      frameProps: {
        title: course.name,
        standardWidth: false,
        padding: false,
      },
    },
  ];

  return state.find((s) => s.regex.test(url)) ?? state[0]!;
};

export default function ClassroomPageLayout({
  children,
  params: { courseId },
}: Readonly<{
  children: React.ReactNode;
  params: { courseId: string };
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const router = useRouter();

  const onClickNavigateToCourse = useCallback(() => {
    void router.push(`/course/${courseId}`);
  }, [courseId, router]);

  const backend = useBackend();

  useEffect(() => {
    const inner = async () => {
      setRole(null);
      setError(null);
      setIsLoading(true);
      setCourse(null);

      try {
        const { courses } = await backend.getCourses({ courseIds: [courseId] });
        const course = courses[0];

        if (!course) {
          setError("Course not found");
          return;
        }

        const { role } = await backend.getRoleInCourse({
          courseId: course.id,
        });

        setRole(role);
        setCourse(course);
        setIsLoading(false);
      } catch (e) {
        if (e instanceof APIError) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }

        setRole(null);
        setCourse(null);
        setIsLoading(false);
      }
    };

    void inner();
  }, [backend, courseId]);

  const pathName = usePathname();

  if (isLoading) {
    return (
      <PageFrame title="Course Overview">
        <CenteredLoading />
      </PageFrame>
    );
  }

  if (error) {
    return (
      <PageFrame title="Course Overview">
        <div>{error}</div>
      </PageFrame>
    );
  }

  if (!course) {
    return (
      <PageFrame title="Course Overview">
        <div>An unexpected error occurred.</div>
      </PageFrame>
    );
  }

  const left = (
    <>
      {pathName !== `/course/${courseId}` && (
        <Button variant="soft" onClick={onClickNavigateToCourse}>
          <IoArrowBackSharp />
          <div className="hidden md:block">Back to course page</div>
        </Button>
      )}
    </>
  );

  const state = mapApplicationState(course, pathName);

  return (
    <CourseContext.Provider value={course}>
      <CourseRoleContext.Provider value={role ?? ""}>
        <PageFrame left={left} {...state.frameProps}>
          {children}
        </PageFrame>
      </CourseRoleContext.Provider>
    </CourseContext.Provider>
  );
}
