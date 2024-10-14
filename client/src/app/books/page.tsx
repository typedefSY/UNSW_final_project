"use client";

import { Course, CourseBook } from "@/backend";
import { CenteredLoading } from "@/components/loading";
import { PageFrame } from "@/components/structural/PageFrame";
import { useBackend } from "@/hooks/useBackend";
import { Card } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BiBook } from "react-icons/bi";

interface BooksProps {}

const Books: React.FC<BooksProps> = () => {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [books, setBooks] = useState<Record<string, CourseBook[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const backend = useBackend();
  const router = useRouter();

  const onClickBook = useCallback(
    (book: CourseBook) => {
      router.push(`/course/${book.course!.id}/books?page=${book.id}`);
    },
    [router],
  );

  useEffect(() => {
    const inner = async () => {
      setIsLoading(true);

      const { courses } = await backend.getUserCourses({});

      const courseMap: Record<string, Course> = {};

      courses.forEach((c) => {
        courseMap[c.id] = c;
      });

      setCourseList(courses);

      const bookMap: Record<string, CourseBook[]> = {};

      for (const course of courses) {
        const { books } = await backend.getBooksByCourse({
          courseID: course.id,
        });
        bookMap[course.id] = books;
      }

      setBooks(bookMap);
      setIsLoading(false);
    };

    void inner();
  }, [backend]);

  if (isLoading) {
    return (
      <PageFrame title="Loading books...">
        <CenteredLoading></CenteredLoading>
      </PageFrame>
    );
  }

  return (
    <PageFrame title="My Books" padding>
      <div className="py-4 flex flex-col space-y-4">
        {courseList.map((c) => (
          <>
            {books[c.id] && books[c.id]!.length > 0 && (
              <div className="flex flex-col space-y-4" key={c.id}>
                <div className="font-bold text-lg">{c.name}</div>

                {/* Book List */}
                <div>
                  <Card>
                    <div className="flex flex-col space-y-2">
                      {books[c.id]!.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => {
                            onClickBook(book);
                          }}
                          className="px-2 py-1 flex space-x-2 items-center select-none hover:bg-gray-100 rounded-md cursor-pointer"
                        >
                          <BiBook />
                          <div>{book.title}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </PageFrame>
  );
};

export default Books;
