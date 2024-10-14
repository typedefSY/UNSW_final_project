import {
  APIError,
  GetCourseMembersRequest,
  GetCourseMembersResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { courseMembershipDBToAPI } from "@/converts/course";
import { userDBToAPI } from "@/converts/user";
import { getUsersByIDs } from "@/data/auth";
import { getCourseMemberships } from "@/data/course";
import { hasTeacherRoleInCourse } from "@/data/permissions";

// getCourseMembers implements the getCourseMembers endpoint.
export const getCourseMembers = async (
  ctx: any,
  { courseID }: GetCourseMembersRequest,
): Promise<GetCourseMembersResponse> => {
  const user = useCurrentUser(ctx)!;

  if (!(await hasTeacherRoleInCourse(user, courseID))) {
    throw new APIError("No permission to view course members");
  }

  const memberships = await getCourseMemberships(courseID);

  const users = await getUsersByIDs(memberships.map((m) => m.userID));

  return {
    memberships: memberships.map(courseMembershipDBToAPI),
    users: users.map(userDBToAPI),
  };
};
