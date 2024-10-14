import { useBackend } from "@/hooks/useBackend";
import { Button, Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import {
  CourseMetadata,
  CourseMetadataForm,
} from "../course/CourseMetadataForm";

export const CreateCourseButton: React.FC = () => {
  const backend = useBackend();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [courseMetadata, setCourseMetadata] = useState<CourseMetadata>({
    description: "",
    name: "",
  });

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    const { course } = await backend.createCourse({
      ...courseMetadata,
    });

    router.push(`/course/${course.id}`);
  }, [backend, courseMetadata, router]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="solid" size={"3"}>
          Create Course
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="bg-white rounded-3xl shadow-lg">
        <Dialog.Title>Create Course</Dialog.Title>
        <CourseMetadataForm
          metadata={courseMetadata}
          onChangeMetadata={setCourseMetadata}
          onClickDone={handleSubmit}
          isLoading={isLoading}
          doneButtonLabel="Create Course"
        />
      </Dialog.Content>
    </Dialog.Root>
  );
};
