import {
  FetchUserSevenDayActivityRequest,
  FetchUserSevenDayActivityResponse,
} from "@/apis";

// fetchUserSevenDayActivity implements the fetchUserSevenDayActivity endpoint.
export const fetchUserSevenDayActivity = async (
  ctx: any,
  request: FetchUserSevenDayActivityRequest,
): Promise<FetchUserSevenDayActivityResponse> => {
  return {
    activity: {
      activities: [3, 5, 2, 1, 7, 8, 2],
    },
  };
};
