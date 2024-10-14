import React, { useCallback, useMemo } from "react";

interface AssessmentInfoProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
}

const AssessmentInfo: React.FC<AssessmentInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  endDate,
  setEndDate,
  startDate,
  setStartDate,
}) => {
  const minStartDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }, []);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [setTitle],
  );

  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(event.target.value);
    },
    [setDescription],
  );

  const handleEndDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
    },
    [setEndDate],
  );

  const handleStartDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(event.target.value);
    },
    [setStartDate],
  );

  return (
    <div className="p-4 bg-blue-100 rounded-2xl border-2 border-blue-500">
      <div className="mb-4">
        <label htmlFor="title" className="text-md font-medium block mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Exam/quiz Title"
          required
          value={title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:border-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="text-md font-medium block mb-2">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter description of the exam/quiz"
          required
          value={description}
          onChange={handleDescriptionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:border-2"
          rows={4}
        />
      </div>
      <div className="flex justify-between">
        {/* Start Date Input */}
        <div className="w-2/5">
          <label htmlFor="startDate" className="text-md font-medium block mb-2">
            Start Date
          </label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={handleStartDateChange}
            min={minStartDate}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:border-2"
          />
        </div>
        <div className="w-2/5">
          <label htmlFor="endDate" className="text-md font-medium block mb-2">
            End Date
          </label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:border-2"
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentInfo;
