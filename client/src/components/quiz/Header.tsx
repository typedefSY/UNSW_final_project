import React, { useState, useEffect } from "react";
import { TimeUpDialog } from "./TimeUpDiaog";

interface QuizInfoProps {
  title: string;
  description?: string;
  endDate: string;
  onSubmit: () => void;
}

const QuizHeader: React.FC<QuizInfoProps> = ({
  title,
  description,
  endDate,
  onSubmit,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      let timeLeft = "";

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        timeLeft = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        timeLeft = "Time's up!";
      }

      return { difference, timeLeft };
    };

    const updateTimer = () => {
      const { difference, timeLeft } = calculateTimeLeft();
      setTimeLeft(timeLeft);
      // Automatically submit when time is up
      if (difference <= 0) {
        clearInterval(timer);
        onSubmit();
        setIsTimeUp(true);
      }
    };

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endDate, onSubmit]);

  return (
    <div className="flex justify-between items-center p-4 rounded-lg border-2 border-blue-500">
      <div className="space-y-2 max-w-[70%]">
        <h1 className="text-4xl font-bold text-[#004E89]">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="space-y-3">
        <p className="font-semibold">Time Left: {timeLeft}</p>
        <div className="flex flex-wrap justify-end">
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-opacity-90 font-bold"
            onClick={onSubmit}
          >
            submit
          </button>
        </div>
      </div>
      <TimeUpDialog isOpen={isTimeUp} setIsOpen={setIsTimeUp} />
    </div>
  );
};

export default QuizHeader;
