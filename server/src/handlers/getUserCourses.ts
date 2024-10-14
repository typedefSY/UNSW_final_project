import {
  APIError,
  GetUserCoursesRequest,
  GetUserCoursesResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import {
  courseMembershipDBToAPI,
  courseWithCreatedByDBToAPI,
} from "@/converts/course";
import { getCoursesByIDs, getUserCourseMembership } from "@/data/course";

// getUserCourses implements the getUserCourses endpoint.
export const getUserCourses = async (
  ctx: any,
  request: GetUserCoursesRequest,
): Promise<GetUserCoursesResponse> => {
  const user = useCurrentUser(ctx)!;

  const memberships = await getUserCourseMembership(user.id);

  const courses = await getCoursesByIDs(memberships.map((m) => m.courseID));

  if (!courses) {
    throw new APIError("Not all courses can be retrieved.");
  }

  const apiCourses = courses.map(courseWithCreatedByDBToAPI);
  const apiMemberships = memberships.map(courseMembershipDBToAPI);

  return {
    courses: apiCourses,
    memberships: apiMemberships,
  };
};
