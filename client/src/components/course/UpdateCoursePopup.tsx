import { useBackend } from "@/hooks/useBackend";
import { Button, Dialog } from "@radix-ui/themes";
import React, { useCallback, useEffect, useState } from "react";
import { CourseMetadata, CourseMetadataForm } from "./CourseMetadataForm";
import { Course } from "@/backend";

export const UpdateCoursePopup: React.FC<{
  course: Course;
}> = ({ course }) => {
  const backend = useBackend();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [courseMetadata, setCourseMetadata] = useState<CourseMetadata>({
    code: course.code,
    description: course.description ?? "",
    name: course.name,
    imageURL: course.imageURL,
  });

  useEffect(() => {
    setCourseMetadata({
      code: course.code,
      description: course.description ?? "",
      name: course.name,
      imageURL: course.imageURL,
    });
  }, [course]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    await backend.updateCourse({
      ...courseMetadata,
      id: course.id,
    });

    setIsOpen(false);
    setIsLoading(false);

    window.location.reload();
  }, [backend, course, courseMetadata]);

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger>
        <Button variant="solid" size={"3"}>
          Edit Course
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="bg-white rounded-3xl shadow-lg">
        <Dialog.Title>Edit Course</Dialog.Title>
        <CourseMetadataForm
          metadata={courseMetadata}
          onChangeMetadata={setCourseMetadata}
          onClickDone={handleSubmit}
          isLoading={isLoading}
          doneButtonLabel="Update"
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};
