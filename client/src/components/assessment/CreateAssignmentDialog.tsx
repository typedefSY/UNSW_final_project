import { useBackend } from "@/hooks/useBackend";
import { Button, Dialog, TextArea, TextField } from "@radix-ui/themes";
import React, { useCallback, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useCourse } from "@/contexts/CourseContext";

interface CreateAssignmentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUpdateAssignments: () => void;
}

export const CreateAssignmentDialog: React.FC<CreateAssignmentProps> = ({
  isOpen,
  setIsOpen,
  onUpdateAssignments,
}) => {
  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const backend = useBackend();
  const courseId = useCourse().id;

  const minStartDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }, []);

  const handleAssignmentNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAssignmentName(e.target.value);
    },
    [],
  );

  const handleAssignmentDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setAssignmentDescription(e.target.value);
    },
    [],
  );

  const handleAssignmentStartDateChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value);
    },
    [],
  );

  const handleAssignmentEndDateChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
    },
    [],
  );

  const resetForm = useCallback(() => {
    setAssignmentName("");
    setAssignmentDescription("");
    setStartDate("");
    setEndDate("");
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        await backend.createAssessment({
          title: assignmentName,
          description: assignmentDescription,
          courseId: courseId,
          startDate: startDate,
          dueDate: endDate,
          type: "assignment",
        });
        setIsOpen(false);
        onUpdateAssignments();
        resetForm();
      } catch (error) {
        console.error("Failed to create assignment:", error);
      }
    },
    [
      assignmentName,
      assignmentDescription,
      startDate,
      endDate,
      backend,
      setIsOpen,
      onUpdateAssignments,
      resetForm,
      courseId,
    ],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [setIsOpen, resetForm]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="bg-white px-10 py-6 rounded-3xl shadow-lg">
        <Dialog.Title className="flex justify-between items-start">
          Create Assignment
          <button onClick={handleClose}>×</button>
        </Dialog.Title>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="assignmentName"
              className="block text-lg font-medium mt-2"
            >
              Assignment Name
            </label>
            <TextField.Root
              value={assignmentName}
              onChange={handleAssignmentNameChange}
              placeholder="Enter assignment name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="assignmentDescription"
              className="block text-lg font-medium mt-2"
            >
              Assgnment Description
            </label>
            <TextArea
              value={assignmentDescription}
              onChange={handleAssignmentDescriptionChange}
              placeholder="Enter assignment description"
              required
            />
          </div>
          <div className="flex justify-between">
            <div className="w-2/5">
              <label
                htmlFor="startDate"
                className="block text-lg font-medium mt-2"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={handleAssignmentStartDateChange}
                min={minStartDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="w-2/5">
              <label htmlFor="endDate" className="block text-lg font-medium">
                Due Date
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={handleAssignmentEndDateChange}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="solid" type="submit" size={"3"}>
              Create Assignment
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
