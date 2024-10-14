import { APIError, JoinCourseRequest, JoinCourseResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { courseWithCreatedByDBToAPI } from "@/converts/course";
import {
  getCourseByID,
  getInvitation,
  mapCourseRoleString,
} from "@/data/course";
import { joinCourse as joinCourseDB } from "@/data/course";

// joinCourse implements the joinCourse endpoint.
export const joinCourse = async (
  ctx: any,
  request: JoinCourseRequest,
): Promise<JoinCourseResponse> => {
  const user = useCurrentUser(ctx)!;
  const invitation = await getInvitation(request.code);

  if (!invitation) {
    throw new APIError("Invitation not found.");
  }

  const course = await getCourseByID(invitation.courseID);

  if (!course) {
    throw new APIError("Course not found.");
  }

  await joinCourseDB(user.id, course.id, mapCourseRoleString(invitation.role));

  return { course: courseWithCreatedByDBToAPI(course) };
};
