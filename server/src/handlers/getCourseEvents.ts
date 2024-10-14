import { GetCourseEventsRequest, GetCourseEventsResponse } from "@/apis";
import { fetchAllEventByCourse } from "@/data/calendar";

// getCourseEvents implements the getCourseEvents endpoint.
export const getCourseEvents = async (
  ctx: any,
  request: GetCourseEventsRequest,
): Promise<GetCourseEventsResponse> => {
  let { courseId } = request;
  let events = await fetchAllEventByCourse(courseId);
  return {
    events,
  };
};
