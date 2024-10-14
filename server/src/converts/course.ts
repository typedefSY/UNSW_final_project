import { Course as CourseAPI } from "@/apis";
import { userDBToAPI } from "./user";
import { CourseWithCreatedBy } from "@/data/course";
import { CourseMembers as CourseMembershipDB } from "@prisma/client";
import { CourseMembership } from "@/apis";

export const courseWithCreatedByDBToAPI = (
  course: CourseWithCreatedBy,
): CourseAPI => {
  return {
    id: course.id,
    name: course.name,
    description: course.description ?? undefined,
    code: course.code ?? undefined,
    imageURL: course.imageURL ?? undefined,
    createdAt: course.createdAt.getTime(),
    createdBy: userDBToAPI(course.createdBy),
  };
};

export const courseMembershipDBToAPI = (
  membership: CourseMembershipDB,
): CourseMembership => {
  return {
    courseId: membership.courseID,
    role: membership.role,
    userId: membership.userID,
    createdAt: membership.createdAt.getTime(),
  };
};
