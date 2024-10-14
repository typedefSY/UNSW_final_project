import { Course, CourseBook, isAPIError } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { Text, Button, Dialog, TextField } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useState } from "react";

interface Props extends PropsWithChildren {
  course: Course;
  parent?: CourseBook;
  onCreated?: (book: CourseBook) => void;
}

export const CreateBookForm: React.FC<Props> = ({
  children,
  course,
  parent,
  onCreated,
}) => {
  const backend = useBackend();
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onClickCreate = useCallback(async () => {
    try {
      const { book } = await backend.createBook({
        courseID: course.id,
        title: name,
        parentID: parent?.id,
      });

      setIsOpen(false);
      setName("");
      onCreated?.(book);
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }, [backend, course.id, name, onCreated, parent?.id]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      {error ? (
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Something went wrong.</Dialog.Title>
          <div className="flex flex-col space-y-2">
            <div>{error}</div>
          </div>
        </Dialog.Content>
      ) : (
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>
            Create a new page within {parent?.title ?? course.name}
          </Dialog.Title>
          <div className="flex flex-col space-y-4 my-4">
            <div className="flex items-center justify-between">
              <Text weight="bold">Name</Text>
              <TextField.Root
                variant="surface"
                placeholder="The name of the page."
                className="w-3/4"
                size="3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClickCreate}>Create</Button>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};
