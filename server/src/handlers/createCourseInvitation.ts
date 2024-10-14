import {
  APIError,
  CreateCourseInvitationRequest,
  CreateCourseInvitationResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import {
  createInvitation,
  getCourseByID,
  getCourseMemberships,
  getRoleInCourse,
  mapCourseRoleString,
} from "@/data/course";
import { CourseRole } from "@prisma/client";

// createCourseInvitation implements the createCourseInvitation endpoint.
export const createCourseInvitation = async (
  ctx: any,
  request: CreateCourseInvitationRequest,
): Promise<CreateCourseInvitationResponse> => {
  const user = useCurrentUser(ctx)!;
  const course = await getCourseByID(request.courseId);

  if (!course) {
    throw new APIError("Course not found.");
  }

  const memberships = await getCourseMemberships(course.id);

  const isTeacher =
    (await getRoleInCourse(user.id, course.id)) === CourseRole.TEACHER;

  console.log(memberships, user.id, course.id, isTeacher);

  if (!isTeacher) {
    throw new APIError(
      "You are not authorized to invite users to this course.",
    );
  }

  const role = mapCourseRoleString(request.role);

  const code = await createInvitation(course.id, user.id, role);

  return {
    code,
  };
};
