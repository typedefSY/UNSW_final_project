import { FetchUserStatsRequest, FetchUserStatsResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getUserCourseMembership } from "@/data/course";

// fetchUserStats implements the fetchUserStats endpoint.
export const fetchUserStats = async (
  ctx: any,
  request: FetchUserStatsRequest,
): Promise<FetchUserStatsResponse> => {
  const user = useCurrentUser(ctx)!;

  const members = await getUserCourseMembership(user.id);
  return {
    stats: {
      coursesCompleted: 0,
      coursesInProgress: members.length,
      tasksFinished: 2,
    },
  };
};
