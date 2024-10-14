import { Course, isAPIError } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import {
  Text,
  Button,
  Dialog,
  SegmentedControl,
  TextField,
} from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useState } from "react";

interface Props extends PropsWithChildren {
  course: Course;
}

export const ScheduleCourseForm: React.FC<Props> = ({ children, course }) => {
  const backend = useBackend();
  const [classLink, setClassLink] = useState<string>("");
  const [classType, setClassType] = useState("lecture");
  const [startDate, setStartDate] = useState<string>("");
  const [scheduleSuccess, setScheduleSuccess] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // const onClickInvite = useCallback(async () => {
  //   try {
  //     const { code } = await backend.createCourseInvitation({
  //       courseId: course.id,
  //       role,
  //     });

  //     setInvitationCode(code);
  //   } catch (e) {
  //     if (isAPIError(e)) {
  //       setError(e.message);
  //     } else {
  //       setError("An unexpected error occurred.");
  //     }
  //   }
  // }, [backend, course.id, role]);

  const onClickSchedule = useCallback(async () => {
    console.log("Schedule class: ", classLink, classType, startDate);
    try {
      await backend.addScheduleClass({
        scheduleClass: {
          classLink,
          classType,
          startDate,
          courseID: course.id,
        },
      });
      setScheduleSuccess(true);
    } catch (e) {
      if (isAPIError(e)) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }, [classLink, classType, startDate, backend, course.id]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      {error ? (
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Something went wrong.</Dialog.Title>
          <div className="flex flex-col space-y-2">
            <div>{error}</div>
          </div>
        </Dialog.Content>
      ) : scheduleSuccess ? (
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Class scheduled successfully</Dialog.Title>
          <div className="flex flex-col space-y-2">
            <div>Your class has been scheduled successfully.</div>
          </div>
        </Dialog.Content>
      ) : (
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Schedule a class for {course.name}</Dialog.Title>
          <div className="flex flex-col space-y-4 my-4">
            <div className="flex items-center justify-between">
              <Text weight="bold">Link</Text>
              <TextField.Root
                variant="surface"
                placeholder="Add the Lec/Tut link."
                className="w-3/4"
                size="3"
                value={classLink}
                onChange={(e) => setClassLink(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Text weight="bold">Type</Text>
              <SegmentedControl.Root
                defaultValue="lecture"
                radius="full"
                onValueChange={setClassType}
              >
                <SegmentedControl.Item value="lecture">
                  Lecture
                </SegmentedControl.Item>
                <SegmentedControl.Item value="tutorial">
                  Tutorial
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </div>
            <div className="flex items-center justify-between">
              <Text weight="bold">Start Time</Text>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-3/4 px-3 py-2 border border-gray-400 text-gray-400 rounded-md focus:outline-none focus:border-blue-500 focus:border-2"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClickSchedule}>Schedule</Button>
          </div>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};
