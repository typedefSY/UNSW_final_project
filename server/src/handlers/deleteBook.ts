import { APIError, DeleteBookRequest, DeleteBookResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { getBookByID, deleteBook as deleteBookDB } from "@/data/books";
import { hasTeacherRoleInCourse } from "@/data/permissions";

// deleteBook implements the deleteBook endpoint.
export const deleteBook = async (
  ctx: any,
  { id }: DeleteBookRequest,
): Promise<DeleteBookResponse> => {
  const user = useCurrentUser(ctx)!;

  const current = await getBookByID(id);

  if (!current) {
    throw new APIError("Book not found");
  }

  if (!(await hasTeacherRoleInCourse(user, current.courseID))) {
    throw new APIError(
      "You don't have the permission to create a book in this course.",
    );
  }

  await deleteBookDB(id);

  return {};
};
