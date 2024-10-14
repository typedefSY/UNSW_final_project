import {
  getAnnouncements as getAnnouncementsDB,
  getCourseByForumID,
  getCoursesByForumIDs,
  getForumsByCourseIDs,
  mapThreadIDsToCourses,
} from "@/data/forum";
import {
  Course,
  GetAnnouncementsRequest,
  GetAnnouncementsResponse,
} from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getUserCourseMembership } from "@/data/course";
import { threadWithPostsDBToAPI } from "@/converts/forum";
import { courseWithCreatedByDBToAPI } from "@/converts/course";

// getAnnouncements implements the getAnnouncements endpoint.
export const getAnnouncements = async (
  ctx: any,
  { courseIDs }: GetAnnouncementsRequest,
): Promise<GetAnnouncementsResponse> => {
  const user = useCurrentUser(ctx)!;

  const cIDs =
    courseIDs ??
    (await getUserCourseMembership(user.id)).map((c) => c.courseID);

  const forums = await getForumsByCourseIDs(cIDs);

  const threads = await getAnnouncementsDB(forums.map((f) => f.id));

  const threadToCourseDB = await mapThreadIDsToCourses(
    threads.map((t) => t.id),
  );

  const threadToCourseAPI: Record<string, Course> = {};

  for (const [threadID, course] of Object.entries(threadToCourseDB)) {
    threadToCourseAPI[threadID] = courseWithCreatedByDBToAPI(course);
  }

  return {
    threads: threads.map(threadWithPostsDBToAPI),
    threadToCourse: threadToCourseAPI,
  };
};
