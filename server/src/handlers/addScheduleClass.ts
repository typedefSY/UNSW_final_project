import { AddScheduleClassRequest, AddScheduleClassResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { createScheduleClass } from "@/data/calendar";

// addScheduleClass implements the addScheduleClass endpoint.
export const addScheduleClass = async (
  ctx: any,
  request: AddScheduleClassRequest,
): Promise<AddScheduleClassResponse> => {
  const { scheduleClass } = request;
  const user = useCurrentUser(ctx);
  await createScheduleClass(user!.id, scheduleClass);
  return {};
};
