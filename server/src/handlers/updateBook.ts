import { APIError, UpdateBookRequest, UpdateBookResponse } from "@/apis";
import { useCurrentUser } from "@/context/auth";
import { courseBookWithCourseAndTreeDBToAPI } from "@/converts/books";
import { getUsersByIDs } from "@/data/auth";
import { getBookByID, updateBook as updateBookDB } from "@/data/books";
import { getCourseByID, getCourseMemberships } from "@/data/course";
import { sendEmailFromTemplate } from "@/data/mailer";
import { hasTeacherRoleInCourse } from "@/data/permissions";
import { pageUpdateEmail } from "@/mailerTemplates/bookUpdate";
import { CourseBook } from "@prisma/client";

const notifyBookUpdate = async (book: CourseBook) => {
  const course = (await getCourseByID(book.courseID))!;

  const users = await getCourseMemberships(course.id);

  const recipients = await getUsersByIDs(users.map((u) => u.userID));

  recipients.forEach(async (user) => {
    console.log(`Notifying user ${user.email} about book update.`);
    await sendEmailFromTemplate(user.email, pageUpdateEmail, {
      course: course,
      recipient: user,
      book: book,
    });
  });

  return;
};

// updateBook implements the updateBook endpoint.
export const updateBook = async (
  ctx: any,
  { id, title, content }: UpdateBookRequest,
): Promise<UpdateBookResponse> => {
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

  const book = await updateBookDB({
    id,
    title,
    content,
  });

  notifyBookUpdate(book);

  return { book: courseBookWithCourseAndTreeDBToAPI(book) };
};
