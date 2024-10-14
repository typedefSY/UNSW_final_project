import { GetUserEventsRequest, GetUserEventsResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { fetchAllEventByUser } from "@/data/calendar";

// getUserEvents implements the getUserEvents endpoint.
export const getUserEvents = async (
  ctx: any,
  request: GetUserEventsRequest,
): Promise<GetUserEventsResponse> => {
  let user = useCurrentUser(ctx);
  let events = await fetchAllEventByUser(user?.id!);
  return {
    events,
  };
};
