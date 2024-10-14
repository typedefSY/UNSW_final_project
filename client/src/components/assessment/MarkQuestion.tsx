import React, { useState } from "react";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import { Heading } from "@radix-ui/themes";

type QuestionProps = {
  title: string;
  points: number; // full mark
  sampleAnswer: string;
  studentAnswer: string;
  onScoreChange: (score: number) => void;
};

export const MarkQestion: React.FC<QuestionProps> = ({
  title,
  points,
  sampleAnswer,
  studentAnswer,
  onScoreChange,
}) => {
  const [score, setScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    if (newScore >= 0 && newScore <= points) {
      setScore(newScore);
      onScoreChange(newScore);
    }
  };

  return (
    <div className="flex flex-col p-4 border-2 border-blue-500 space-y-4 rounded-lg">
      <Heading>{title}</Heading>

      <Heading size="5">Sample Answer</Heading>
      <p>{sampleAnswer}</p>

      <Heading size="5">Student Answer</Heading>
      <p>{studentAnswer}</p>

      <div className="flex flex-wrap justify-end items-center">
        <span className="mr-3 text-lg">Mark</span>
        <input
          id="mark"
          type="text"
          value={score}
          max={points}
          onChange={(e) => {
            handleScoreChange(Number(e.target.value));
          }}
          className="p-2 border w-20 rounded-md"
        />
        <div className="flex flex-col h-full">
          <button
            type="button"
            onClick={() => handleScoreChange(score + 1)}
            className="p-1 text-blue-700 h-2/5 text-lg"
          >
            <GoTriangleUp />
          </button>
          <button
            type="button"
            onClick={() => handleScoreChange(score - 1)}
            className="p-1 text-blue-700 h-1/2 text-lg"
          >
            <GoTriangleDown />
          </button>
        </div>
      </div>
    </div>
  );
};
