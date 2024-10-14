import { CourseBook as CourseBookDB } from "@prisma/client";
import { CourseBook as CourseBookAPI } from "@/apis";
import { CourseBookWithCourseAndTree } from "@/data/books";
import { courseWithCreatedByDBToAPI } from "./course";

export const courseBookWithCourseAndTreeDBToAPI = (
  courseBook: CourseBookWithCourseAndTree,
): CourseBookAPI => {
  return {
    id: courseBook.id,
    title: courseBook.title,
    childrenIDs: courseBook.children.map((c) => c.id),
    children: courseBook.children.map((c) => courseBookDBToAPI(c)),
    course: courseWithCreatedByDBToAPI(courseBook.course),
    parentID: courseBook.parent?.id,
    parent: courseBook.parent
      ? courseBookDBToAPI(courseBook.parent)
      : undefined,
    content: courseBook.content,
  };
};

function courseBookDBToAPI(courseBook: CourseBookDB): CourseBookAPI {
  return {
    id: courseBook.id,
    title: courseBook.title,
    content: courseBook.content,
  };
}
