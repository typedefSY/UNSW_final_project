import { Button, Dialog, TextField } from "@radix-ui/themes";
import React, { useCallback, useState } from "react";
import type { ChangeEvent } from "react";

interface CreateFolderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createNewFolder: (name: string) => void;
}

export const CreateFolderPopup: React.FC<CreateFolderProps> = ({
  isOpen,
  setIsOpen,
  createNewFolder,
}) => {
  const [folderName, setFolderName] = useState("");

  const handleFolderNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFolderName(e.target.value);
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFolderName("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [setIsOpen, resetForm]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      createNewFolder(folderName);
      handleClose();
    },
    [folderName, createNewFolder, handleClose],
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="bg-white px-10 py-6 rounded-3xl shadow-lg">
        <Dialog.Title className="flex justify-between items-start">
          Create New Folder
          <button onClick={handleClose}>×</button>
        </Dialog.Title>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="folderName"
              className="block text-lg font-medium mt-2"
            >
              Folder Name
            </label>
            <TextField.Root
              value={folderName}
              onChange={handleFolderNameChange}
              placeholder="New Folder"
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="solid" type="submit" size={"3"}>
              Create a new folder
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
