import React from "react";
import { Heading, Badge } from "@radix-ui/themes";

interface AssessmentHeaderProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  title,
  description,
  startDate,
  endDate,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}-${hours}:${minutes}`;
  };

  return (
    <div className="px-6 py-4 rounded-lg bg-gray-50">
      <div className="flex justify-center mb-4">
        <Heading size="8" trim="both">
          {title}
        </Heading>
      </div>
      <div className="mb-2">
        <Heading trim="both">Description</Heading>
        <div className="px-3 py-2">{description}</div>
      </div>
      <div className="flex justify-between">
        <div className="w-2/5">
          <Heading trim="both">Start Date</Heading>
          <Badge color="green" className="p-2 mt-2 rounded-md">
            {formatDate(startDate)}
          </Badge>
        </div>
        <div className="w-2/5">
          <Heading trim="both">End Date</Heading>
          <Badge className="p-2 mt-2 rounded-md">{formatDate(endDate)}</Badge>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHeader;
