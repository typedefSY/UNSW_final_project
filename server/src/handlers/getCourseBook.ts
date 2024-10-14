import { APIError, GetCourseBookRequest, GetCourseBookResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { courseBookWithCourseAndTreeDBToAPI } from "@/converts/books";
import { getBookByIDs } from "@/data/books";
import { hasTeacherRoleInCourse, userInCourse } from "@/data/permissions";

// getCourseBook implements the getCourseBook endpoint.
export const getCourseBook = async (
  ctx: any,
  { bookIDs }: GetCourseBookRequest,
): Promise<GetCourseBookResponse> => {
  const books = await getBookByIDs(bookIDs);

  const courseID = books.map((b) => b.courseID);

  const courseIDs = [...new Set(courseID)];

  const user = useCurrentUser(ctx)!;

  for (let i = 0; i < courseIDs.length; i++) {
    const courseID = courseIDs[i]!;

    if (!(await userInCourse(user, courseID))) {
      throw new APIError(
        "You don't have the permission to view this resource.",
      );
    }
  }

  return {
    books: books.map((b) => courseBookWithCourseAndTreeDBToAPI(b)),
  };
};
