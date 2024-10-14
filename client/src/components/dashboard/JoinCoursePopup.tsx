import React, { useState, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Callout, Dialog, TextField } from "@radix-ui/themes";
import { useBackend } from "@/hooks/useBackend";
import { useRouter } from "next/navigation";
import { VscError } from "react-icons/vsc";

export const JoinCourseButton: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState(false);

  const backend = useBackend();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (finalCode: string) => {
      try {
        const { course } = await backend.joinCourse({ code: finalCode });
        console.log("Joined course:", course);
        router.push(`/course/${course.id}`);
      } catch {
        setIsInvalid(true);
      }
    },
    [backend, router],
  );

  const onChangeCode = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length > 6) return;
      if (value.length < 6) {
        setIsInvalid(false);
      }
      setCode(value);
      if (value.length === 6) {
        void handleSubmit(value);
      }
    },
    [handleSubmit],
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="surface" size={"3"}>
          Join Course
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Join Course</Dialog.Title>
        {isInvalid && (
          <Callout.Root className="my-4" color="red">
            <Callout.Icon>
              <VscError color="red"></VscError>
            </Callout.Icon>
            <Callout.Text>
              The code you have entered seems to be invalid.
            </Callout.Text>
          </Callout.Root>
        )}
        <form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            await handleSubmit(code);
          }}
          className="mt-4"
        >
          <p>Ask your teacher for the class code, then enter it here.</p>
          <div className="flex items-center space-x-2 my-4">
            <TextField.Root
              value={code}
              onChange={onChangeCode}
              className="text-3xl text-center w-full"
              size={"3"}
            ></TextField.Root>
          </div>
        </form>
        <p className="font-bold mt-4">To sign in with a class code:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Use an authorized account</li>
          <li>Use a class code with 6 letters or numbers</li>
        </ul>
        <p>
          If you have trouble joining the class, go to the{" "}
          <a href="/help" className="text-blue-600 underline">
            Help Center article
          </a>
          .
        </p>
      </Dialog.Content>
    </Dialog.Root>
  );
};
