import { EmailGenerator } from "@/data/mailer";
import { generalEmail, generalEmailWithSubject } from "./general";
import { Course, CourseBook, User } from "@prisma/client";
import { generateHTMLFromTiptap } from "@/utils/tiptapHTML";
import { JSONContent } from "@tiptap/core";
import { FRONTEND_ADDRESS } from "@/globals";

interface RegistrationProps {
  book: CourseBook;
  recipient: User;
  course: Course;
}

export const pageUpdateEmail: EmailGenerator<RegistrationProps> = async ({
  book,
  recipient,
  course,
}) => {
  return generalEmailWithSubject({
    subject: `[${course.code ?? course.name}] ${book.title} has been updated`,
    title: "Page Updated",
    name: recipient.firstName,
    content: `There has been updates to the course material ${book.title} in ${
      course.code ?? course.name
    }. Here's a brief summary of the new content:

<hr>
${generateHTMLFromTiptap(book.content as JSONContent)}
<hr>

You can view the updated content <a href="${FRONTEND_ADDRESS}/course/${
      course.id
    }/books?page=${book.id}">here</a>.

If you have any questions or concerns, feel free to reach out to your instructor.`,
    senderName: "BrainWaveBuilder",
  });
};
