import { Course, CourseBook } from "@/backend";
import AdvancedEditor from "../editor/AdvancedEditor";
import { Button, Card } from "@radix-ui/themes";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiBook, BiPencil } from "react-icons/bi";
import { WithTeacherRole } from "@/contexts/CourseRoleContext";
import { CreateBookForm } from "./CreateBookForm";
import { useCallback } from "react";
import { JSONContent } from "novel";
import { DeleteBookConfirmation } from "./DeleteBookConfirmation";

interface BookViewProps {
  isEditing: boolean;
  value: JSONContent | null;
  onChange: (value: JSONContent | null) => void;
}

export const BookView: React.FC<BookViewProps> = ({
  isEditing,
  onChange,
  value,
}) => {
  if (!value) {
    if (isEditing) {
      return (
        <div className="flex justify-center items-center h-96">
          <Button onClick={() => onChange({})}>Add Content</Button>
        </div>
      );
    }

    return <></>;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <AdvancedEditor
        className="min-h-60 border border-muted rounded-md px-4 py-2"
        value={value}
        isEditable={isEditing}
        setValue={onChange}
      />

      {isEditing && (
        <Button onClick={() => onChange(null)}>Remove Content</Button>
      )}
    </div>
  );
};

export const BookList: React.FC<{
  books: CourseBook[];
  current?: CourseBook;
  parent?: CourseBook;
  onClickBook: (book: CourseBook | null) => void;
  course: Course;

  onClickEdit: (book: CourseBook) => void;
  onClickSave: (book: CourseBook) => void;
  onClickDeletePage: (book: CourseBook) => void;
  isEditing: boolean;

  onRefresh: () => void;
}> = ({
  books,
  current,
  parent,
  onClickBook,
  course,
  onClickEdit,
  onClickSave,
  isEditing,
  onRefresh,
  onClickDeletePage,
}) => {
  const onClickEditInner = useCallback(() => {
    if (!current) return;
    onClickEdit?.(current);
  }, [current, onClickEdit]);

  const onClickSaveInner = useCallback(() => {
    if (!current) return;
    onClickSave?.(current);
  }, [current, onClickSave]);

  const onClickDeletePageInner = useCallback(() => {
    if (!current) return;
    onClickDeletePage?.(current);
  }, [current, onClickDeletePage]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {parent ? (
            <Button
              variant="soft"
              onClick={() => {
                onClickBook(parent);
              }}
            >
              <IoArrowBackSharp />
              <div className="hidden md:block">{parent.title}</div>
            </Button>
          ) : current ? (
            <Button
              variant="soft"
              onClick={() => {
                onClickBook(null);
              }}
            >
              <IoArrowBackSharp />
              <div className="hidden md:block">All Course Books</div>
            </Button>
          ) : (
            <></>
          )}
        </div>

        <div>
          <WithTeacherRole>
            <div className="flex space-x-2">
              <CreateBookForm
                course={course}
                parent={current}
                onCreated={onRefresh}
              >
                <Button variant="surface">New Subpage</Button>
              </CreateBookForm>

              {current && (
                <DeleteBookConfirmation
                  book={current}
                  onConfirm={onClickDeletePageInner}
                >
                  <Button variant="surface">Delete Page</Button>
                </DeleteBookConfirmation>
              )}

              {current && (
                <>
                  {isEditing ? (
                    <Button onClick={onClickSaveInner}>
                      <BiPencil />
                      Save
                    </Button>
                  ) : (
                    <Button onClick={onClickEditInner}>
                      <BiPencil />
                      Edit Page
                    </Button>
                  )}
                </>
              )}
            </div>
          </WithTeacherRole>
        </div>
      </div>

      <div className="font-bold text-xl items-center flex space-x-1">
        <BiBook />
        <div>{current?.title ?? "Course Books"}</div>
      </div>

      {books.length > 0 && (
        <Card>
          <div className="flex flex-col space-y-2">
            {books.map((book) => (
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
      )}
    </div>
  );
};
