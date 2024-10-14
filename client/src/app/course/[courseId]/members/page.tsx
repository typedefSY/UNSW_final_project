"use client";

import { CourseMembership, User } from "@/backend";
import { StatefulInviteMembersForm } from "@/components/course/InviteMembersForm";
import { CourseUserCard } from "@/components/course/UserCard";
import { useCourse } from "@/contexts/CourseContext";
import { useBackend } from "@/hooks/useBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import { MdPersonAdd } from "react-icons/md";

const CourseMembersPage = () => {
  const course = useCourse();

  const [memberships, setMemberships] = useState<
    Record<CourseMembership["role"], [User, CourseMembership][]>
  >({});

  const backend = useBackend();

  const fetchMembers = useCallback(async () => {
    const { memberships, users } = await backend.getCourseMembers({
      courseID: course.id,
    });

    const userMap = users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, User>,
    );

    const roleMap: Record<
      CourseMembership["role"],
      [User, CourseMembership][]
    > = {};

    memberships.forEach((m) => {
      if (!roleMap[m.role]) {
        roleMap[m.role] = [];
      }

      roleMap[m.role]!.push([userMap[m.userId]!, m]);
    });

    setMemberships(roleMap);
  }, [backend, course.id]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const onClickRemoveMember = useCallback(
    async (user: User) => {
      await backend.removeMemberFromCourse({
        userID: user.id,
        courseID: course.id,
      });
      await fetchMembers();
    },
    [backend, course.id, fetchMembers],
  );

  const currentUser = useCurrentUser();

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-end w-fit">
        <StatefulInviteMembersForm course={course}>
          <Button className="flex-1 w-fit">
            <MdPersonAdd />
            Invite Members
          </Button>
        </StatefulInviteMembersForm>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="text-lg font-bold">Teachers</div>
        <div className="flex flex-col space-y-2">
          {memberships.TEACHER?.map(([user, m]) => (
            <CourseUserCard
              user={user}
              membership={m}
              key={user.id}
              onClickRemoveMember={
                user.id !== currentUser?.id ? onClickRemoveMember : undefined
              }
            />
          ))}
          {!memberships.TEACHER && (
            <div className="text-gray-500">No teachers in this course.</div>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2 ">
        <div className="text-lg font-bold">Students</div>
        <div className="flex flex-col space-y-2">
          {memberships.STUDENT?.map(([user, m]) => (
            <CourseUserCard
              user={user}
              membership={m}
              key={user.id}
              onClickRemoveMember={onClickRemoveMember}
            />
          ))}
          {!memberships.STUDENT && (
            <div className="text-gray-500">No students in this course.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseMembersPage;
