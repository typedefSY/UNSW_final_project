import { APIError, GetCoursesRequest, GetCoursesResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { courseWithCreatedByDBToAPI } from "@/converts/course";
import { getCoursesByIDs, getUserCourseMembership } from "@/data/course";

// getCourses implements the getCourses endpoint.
export const getCourses = async (
  ctx: any,
  request: GetCoursesRequest,
): Promise<GetCoursesResponse> => {
  const user = useCurrentUser(ctx)!;

  const courses = await getCoursesByIDs(request.courseIds);

  const enrolled = (await getUserCourseMembership(user.id)).map(
    (m) => m.courseID,
  );

  if (courses?.some((c) => !enrolled.includes(c.id))) {
    throw new APIError(
      "You are not authorized to view this course, or they do not exist.",
    );
  }

  if (!courses) {
    throw new APIError(
      request.courseIds.length === 1
        ? "Course not found."
        : "Not all courses can be retrieved.",
    );
  }

  return {
    courses: courses?.map((c) => courseWithCreatedByDBToAPI(c)),
  };
};
