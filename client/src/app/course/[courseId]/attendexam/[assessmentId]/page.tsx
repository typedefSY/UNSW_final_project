"use client";

import React, { useState, useCallback, useEffect } from "react";
import Question from "@/components/quiz/Question";
import QuizHeader from "@/components/quiz/Header";
import { usePathname, useRouter } from "next/navigation";
import { useBackend } from "@/hooks/useBackend";
import { Assessment } from "@/backend";

const Quiz: React.FC = () => {
  const router = useRouter();
  const backend = useBackend();

  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const assessmentId = pathSegments[pathSegments.length - 1];

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assessmentId) {
      const fetchAssessment = async () => {
        if (assessmentId) {
          try {
            const response = await backend.fetchAssessmentDetailsStudent({
              assessmentId,
            });
            setAssessment(response.assessment);
          } catch (error) {
            console.error("Failed to fetch assessment details:", error);
          }
        }
      };

      void fetchAssessment();
    }
  }, [assessmentId, backend]);

  const onSelectAnswer = (questionId: string, selectedAnswer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  const submitAnswersToBackend = useCallback(async () => {
    if (assessmentId) {
      try {
        const answersPayload = Object.entries(answers).map(
          ([questionId, answer]) => ({
            questionId,
            answer,
          }),
        );

        console.log("Submitting answers to backend:", answersPayload);

        await backend.submitAnswers({
          assessmentId,
          answers: answersPayload,
        });
        const newPath = pathName.replace(/\/attendexam\/[^\/]+$/, "");
        router.push(newPath);
      } catch (error) {
        console.error("Failed to submit answers:", error);
        alert("Failed to submit answers, please try again!");
      }
    } else {
      alert("No assessment ID provided");
    }
  }, [answers, backend, assessmentId, pathName, router]);

  if (!assessment) return <div>Loading assessment details...</div>;

  return (
    <div>
      <div className="flex flex-col space-y-4 pt-8 pl-8 pr-8 m-auto max-w-[1200px]">
        <QuizHeader
          title={assessment.title}
          description={assessment.description ?? "No description available"}
          endDate={assessment.dueDate ?? "Due date not set"}
          onSubmit={submitAnswersToBackend}
        />
        {assessment.questions.map((question) => {
          return (
            <Question
              key={question.id}
              id={question.id}
              title={question.title}
              type={question.type}
              options={JSON.parse(String(question.options ?? "[]"))}
              mark={question.points}
              onSelectAnswer={(selectedAnswer) =>
                onSelectAnswer(question.id, selectedAnswer)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default Quiz;
