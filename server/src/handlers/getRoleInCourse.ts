import { GetRoleInCourseRequest, GetRoleInCourseResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getRoleInCourse as getRoleInCourseDB } from "@/data/course";

// getRoleInCourse implements the getRoleInCourse endpoint.
export const getRoleInCourse = async (
  ctx: any,
  { courseId }: GetRoleInCourseRequest,
): Promise<GetRoleInCourseResponse> => {
  const user = useCurrentUser(ctx)!;

  const role = await getRoleInCourseDB(user.id, courseId);

  return { role };
};
