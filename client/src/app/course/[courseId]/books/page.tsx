"use client";

import { useCourse } from "@/contexts/CourseContext";
import { useCallback, useEffect, useState } from "react";
import { CenteredLoading } from "@/components/loading";
import { useBackend } from "@/hooks/useBackend";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseBook } from "@/backend";
import { BookList, BookView } from "@/components/books/BookViewer";
import { JSONContent } from "novel";

const BookPage: React.FC = () => {
  const course = useCourse();

  const backend = useBackend();
  const params = useSearchParams();

  const [currentBook, setCurrentBook] = useState<CourseBook | null>(null);
  const [children, setChildren] = useState<CourseBook[]>([]);

  const activeBookId = params.get("page");

  const fetchAllBooksFromCourse = useCallback(async () => {
    const { books } = await backend.getBooksByCourse({
      courseID: course.id,
    });

    setChildren(books);
  }, [backend, course.id]);

  const fetchBook = useCallback(
    async (bookId: string) => {
      const { books } = await backend.getCourseBook({
        bookIDs: [bookId],
      });

      if (books.length === 0) {
        setCurrentBook(null);
        return;
      }

      setCurrentBook(books[0]!);
      setChildren(books[0]!.children ?? []);
    },
    [backend],
  );

  const refresh = useCallback(() => {
    if (activeBookId === null) {
      setCurrentBook(null);
      void fetchAllBooksFromCourse();
      return;
    }
    void fetchBook(activeBookId);
  }, [activeBookId, fetchAllBooksFromCourse, fetchBook]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const router = useRouter();

  const onChangeActiveThreadId = useCallback(
    (book: CourseBook | null) => {
      router.push(
        `/course/${course.id}/books${book ? "?page=" + book.id : ""}`,
      );
    },
    [course.id, router],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<JSONContent | null>(null);

  useEffect(() => {
    setContent(currentBook?.content ?? null);
  }, [currentBook?.content]);

  const onClickEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onClickSave = useCallback(
    async (book: CourseBook) => {
      await backend.updateBook({
        id: book.id,
        title: book.title,
        content,
      });

      setIsEditing(false);
      void fetchBook(book.id);
    },
    [backend, content, fetchBook],
  );

  const onClickDelete = useCallback(
    async (book: CourseBook) => {
      await backend.deleteBook({
        id: book.id,
      });
      onChangeActiveThreadId(book.parent ?? null);
    },
    [backend, onChangeActiveThreadId],
  );

  if (children === null) return <CenteredLoading />;

  return (
    <div className="flex flex-col space-y-4 h-full py-4 px-2">
      <BookList
        books={children}
        current={currentBook ?? undefined}
        parent={currentBook?.parent}
        onClickBook={onChangeActiveThreadId}
        course={course}
        isEditing={isEditing}
        onClickEdit={onClickEdit}
        onClickSave={onClickSave}
        onRefresh={refresh}
        onClickDeletePage={onClickDelete}
      />

      <BookView
        value={content}
        onChange={setContent}
        isEditing={isEditing}
        key={currentBook?.id}
      />

      {children.length === 0 && !content && (
        <div className="text-gray-500 text-lg">No resources are available.</div>
      )}
    </div>
  );
};

export default BookPage;
