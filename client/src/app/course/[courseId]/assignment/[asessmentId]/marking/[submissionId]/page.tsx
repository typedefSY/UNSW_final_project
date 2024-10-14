"use client";

import React, { useState, useCallback, useEffect } from "react";
import AdvancedEditor from "@/components/editor/AdvancedEditor";
import { Heading } from "@radix-ui/themes";
import { TextArea } from "@radix-ui/themes";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useBackend } from "@/hooks/useBackend";
import { Submission } from "@/backend";

const MarkAssignmentPage: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [mark, setMark] = useState(0);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const backend = useBackend();
  const router = useRouter();
  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const submissionId = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    const fetchSubmissionData = async () => {
      if (submissionId) {
        try {
          const data = await backend.fetchSubmission({ submissionId });
          setSubmission({
            ...data.submission,
            assignmentContent: JSON.parse(
              data.submission.assignmentContent ?? "{}",
            ),
          });
          setFeedback(data.submission.feedback ?? "");
          setMark(data.submission.grade ?? 0);
        } catch (error) {
          console.error("Failed to fetch submission data:", error);
        }
      }
    };

    void fetchSubmissionData();
  }, [submissionId, backend]);

  const handleMarkChange = (newMark: number) => {
    if (newMark >= 0 && newMark <= 100) {
      setMark(newMark);
    }
  };

  const onClickBack = useCallback(() => {
    const newPath = pathName.replace(/\/marking\/[^\/]+/, "");
    router.push(newPath);
  }, [pathName, router]);

  const onClickSave = useCallback(async () => {
    if (submissionId && mark !== null && feedback !== null) {
      try {
        await backend.assignmentGradeSubmission({
          submissionId,
          grades: mark,
          feedback,
        });
        onClickBack();
      } catch (error) {
        console.error("Failed to save marks and feedback:", error);
      }
    }
  }, [submissionId, mark, feedback, backend, onClickBack]);

  if (!submission) return <div>Loading submission...</div>;

  return (
    <div className="flex flex-col p-8 m-auto max-w-[1200px] space-y-4">
      <div className="flex items-center font-bold" onClick={onClickBack}>
        <button className="text-xl" onClick={(e) => e.stopPropagation()}>
          <IoIosArrowBack />
        </button>
        <span className="cursor-pointer">Back</span>
      </div>
      <div className="flex flex-wrap">
        <div className="w-2/3 border-2 p-2 rounded-l-md border-r-0">
          <AdvancedEditor
            value={submission.assignmentContent}
            isEditable={false}
          />
        </div>
        <div className="w-1/3 border-2 rounded-r-md flex flex-col space-y-4 p-2">
          <Heading color="indigo" className="p-2">
            Mark
          </Heading>
          <div className="flex flex-wrap justify-start">
            <input
              id="mark"
              type="text"
              value={mark}
              onChange={(e) => {
                handleMarkChange(Number(e.target.value));
              }}
              className="p-2 border w-20 rounded-md"
            />
            <div className="flex flex-col h-full">
              <button
                type="button"
                onClick={() => handleMarkChange((mark || 0) + 1)}
                className="p-1 text-blue-700 h-2/5 text-lg"
              >
                <GoTriangleUp />
              </button>
              <button
                type="button"
                onClick={() => handleMarkChange((mark || 0) - 1)}
                className="p-1 text-blue-700 h-1/2 text-lg"
              >
                <GoTriangleDown />
              </button>
            </div>
          </div>

          <Heading color="indigo" className="p-2">
            Feedback
          </Heading>
          <TextArea
            size="3"
            className="h-full"
            variant="surface"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type your feedback here..."
          />
          <button
            className="bg-blue-700 text-white p-2 font-medium rounded-md"
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAssignmentPage;
