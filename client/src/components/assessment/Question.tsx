import React from "react";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";

type QuestionProps = {
  id: string;
  title: string;
  type: string;
  options: string[];
  answer: string;
  mark: number;
  onTitleChange: (newTitle: string) => void;
  onTypeChange: (newType: string) => void;
  onOptionsChange: (newOptions: string[]) => void;
  onAnswerChange: (newAnswer: string) => void;
  onMarkChange: (newMark: number) => void;
  onDelete: () => void;
};

const QuestionComponent: React.FC<QuestionProps> = ({
  id,
  title,
  type,
  options,
  answer,
  mark,
  onTitleChange,
  onTypeChange,
  onOptionsChange,
  onAnswerChange,
  onMarkChange,
  onDelete,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    onOptionsChange(updatedOptions);
  };

  const handleAnswerChange = (value: string) => {
    onAnswerChange(value);
  };

  const handleMarkChange = (newMark: number) => {
    if (newMark >= 0) {
      onMarkChange(newMark);
    }
  };

  return (
    <div className="flex flex-col p-4 border-2 border-blue-500 space-y-4 rounded-xl">
      <div className="flex justify-between items-center">
        <label htmlFor="title" className="text-md font-medium mr-2">
          Question
        </label>
        <input
          id="title"
          type="text"
          value={title}
          required
          onChange={handleTitleChange}
          placeholder="Question Title"
          className="p-2 border flex-grow mr-4 border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <select
          value={type}
          onChange={handleTypeChange}
          className="p-2.5 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="short_answer">Short Answer</option>
          <option value="MCQ">Multiple Choice</option>
        </select>
      </div>

      {type === "short_answer" ? (
        <textarea
          className="p-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Sample Answer"
          value={answer}
          required
          onChange={(e) => handleAnswerChange(e.target.value)}
          rows={3}
        />
      ) : (
        <div className="flex flex-col">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3">
              <input
                type="radio"
                name={id}
                checked={answer === option}
                onChange={() => handleAnswerChange(option)}
                required
                className="form-radio h-5 w-5"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                className="p-2 border-b border-blue-300 focus:outline-none focus:border-blue-500 flex-grow"
                placeholder={`MCQ option ${index + 1}`}
              />
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <label htmlFor="mark" className="text-md mr-2 font-medium">
            Points
          </label>
          <div className="relative">
            <input
              id="mark"
              type="text"
              value={mark}
              onChange={(e) => {
                handleMarkChange(Number(e.target.value));
              }}
              className="p-2 border w-20 border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="absolute top-0 right-0 flex flex-col h-full">
              <button
                type="button"
                onClick={() => handleMarkChange(mark + 1)}
                className="p-1 text-blue-500 h-2/5 text-lg"
              >
                <GoTriangleUp />
              </button>
              <button
                type="button"
                onClick={() => handleMarkChange(mark - 1)}
                className="p-1 text-blue-500 h-1/2 text-lg"
              >
                <GoTriangleDown />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-3xl text-red-500 transform transition duration-150 ease-in-out hover:scale-110"
        >
          <MdDeleteOutline />
        </button>
      </div>
    </div>
  );
};

export default QuestionComponent;
