import { APIError, LeaveCourseRequest, LeaveCourseResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getCourseByID } from "@/data/course";
import { leaveCourse as leaveCourseDB } from "@/data/course";

// leaveCourse implements the leaveCourse endpoint.
export const leaveCourse = async (
  ctx: any,
  request: LeaveCourseRequest,
): Promise<LeaveCourseResponse> => {
  const user = useCurrentUser(ctx)!;
  const course = await getCourseByID(request.courseId);

  if (!course) {
    throw new APIError("Course not found.");
  }

  await leaveCourseDB(user.id, course.id);

  return {};
};
