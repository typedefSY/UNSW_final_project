"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { MarkQestion } from "@/components/assessment/MarkQuestion";
import { useBackend } from "@/hooks/useBackend";
import { Submission } from "@/backend";
import { Assessment } from "@/backend";

type Scores = Record<string, number>; // <Qid, score>

const MarkExamPage: React.FC = () => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Scores>({});
  const [totalScore, setTotalScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const backend = useBackend();
  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const submissionId = pathSegments[pathSegments.length - 1];
  const assessmentId = pathSegments[pathSegments.length - 3];

  useEffect(() => {
    if (assessmentId && submissionId) {
      const fetchDetailsAndSubmission = async () => {
        setLoading(true);
        try {
          const [assessmentResponse, submissionResponse] = await Promise.all([
            backend.fetchAssessmentDetailsTeacher({ assessmentId }),
            backend.fetchSubmission({ submissionId }),
          ]);
          setAssessment(assessmentResponse.assessment);
          setSubmission(submissionResponse.submission);
        } catch (err) {
          console.error("Failed to fetch data:", err);
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      };

      if (assessmentId && submissionId) {
        void fetchDetailsAndSubmission();
      }
    }
  }, [submissionId, assessmentId, backend]);

  useEffect(() => {
    setTotalScore(Object.values(scores).reduce((sum, score) => sum + score, 0));
  }, [scores]);

  const handleScoreChange = useCallback((questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  }, []);

  const onClickBack = useCallback(() => {
    router.push(pathName.replace(/\/marking\/[^\/]+$/, ""));
  }, [pathName, router]);

  const onClickSave = useCallback(async () => {
    if (!submissionId || totalScore === null) return;
    try {
      await backend.manualGradeSubmission({
        submissionId,
        saqGrades: totalScore,
      });
      onClickBack();
    } catch (error) {
      console.error("Failed to save total SAQ scores:", error);
      alert("Failed to save scores. Please try again.");
    }
  }, [backend, submissionId, totalScore, onClickBack]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!assessment || !submission) return <div>No data available.</div>;

  function getStudentAnswer(
    answers: { questionId: string; answer?: string }[],
    qId: string,
  ) {
    for (const answer of answers) {
      if (!answer.questionId) {
        continue;
      }
      if (answer.questionId === qId) {
        if (!answer.answer) {
          continue;
        }
        return answer.answer;
      }
    }
  }

  const saqQuestions = assessment.questions
    .filter((q) => q.type === "short_answer")
    .map((question) => ({
      ...question,
      studentAnswer: getStudentAnswer(
        JSON.parse(submission.answers),
        question.id,
      ),
      sampleAnswer: question.answer ?? "No sample answer provided",
    }));

  return (
    <div className="flex flex-col p-8 m-auto max-w-[1200px] space-y-4">
      <div className="flex items-center font-bold" onClick={onClickBack}>
        <button className="text-xl" onClick={(e) => e.stopPropagation()}>
          <IoIosArrowBack />
        </button>
        <span className="cursor-pointer">Back</span>
      </div>
      {saqQuestions.map((question) => (
        <MarkQestion
          key={question.id}
          title={question.title}
          points={question.points}
          studentAnswer={question.studentAnswer!}
          sampleAnswer={question.sampleAnswer}
          onScoreChange={(score) => handleScoreChange(question.id, score)}
        />
      ))}
      <div className="flex justify-end">
        <button
          onClick={onClickSave}
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MarkExamPage;
