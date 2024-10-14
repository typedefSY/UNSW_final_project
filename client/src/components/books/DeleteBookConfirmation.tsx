import { CourseBook } from "@/backend";
import { Button, Dialog } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useState } from "react";

interface Props extends PropsWithChildren {
  book: CourseBook;
  onConfirm?: (book: CourseBook) => void;
}

export const DeleteBookConfirmation: React.FC<Props> = ({
  children,
  book,
  onConfirm,
}) => {
  const onClickConfirm = useCallback(async () => {
    onConfirm?.(book);
  }, [book, onConfirm]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content maxWidth="450px" className="space-y-4">
        <Dialog.Title>Delete {book.title}?</Dialog.Title>
        <div>
          This will delete all associated subpages. This action cannot be
          undone.
        </div>
        <div className="flex justify-end space-x-2">
          <Dialog.Close>
            <Button variant="surface">Cancel</Button>
          </Dialog.Close>

          <Button onClick={onClickConfirm}>Delete</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
