import React, { useState, useEffect } from "react";
import { Heading } from "@radix-ui/themes";
import { Table } from "@radix-ui/themes";
import { WithTeacherRole } from "@/contexts/CourseRoleContext";

interface AssignmentProps {
  id: string;
  name: string;
  startDate: string;
  dueDate: string;
}

interface AssignmentWithStatusProps extends AssignmentProps {
  isCompleted: boolean;
  status: "Not started" | "In Progress" | "Completed";
}

// Define the prop types for the component
interface AssignmentsTableProps {
  assignments: AssignmentProps[];
  type: string;
  onClickAsessment: (assessmentId: string) => void;
  onClickAddButton: () => void;
}

// Component to display a table of assignments
const AssessmentTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  type,
  onClickAddButton,
  onClickAsessment,
}) => {
  const [sortedAssignments, setSortedAssignments] = useState<
    AssignmentWithStatusProps[]
  >([]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const now = new Date();

    const withStatusAndSorted = assignments
      .map((assignment) => {
        const start = new Date(assignment.startDate);
        const due = new Date(assignment.dueDate);
        let status: "Not started" | "In Progress" | "Completed" = "In Progress";

        if (now > due) {
          status = "Completed";
        } else if (now < start) {
          status = "Not started";
        }

        return {
          ...assignment,
          status,
          startDate: formatDate(assignment.startDate),
          dueDate: formatDate(assignment.dueDate),
        };
      })
      .sort((a, b) => {
        const statusOrder = {
          "In Progress": 1,
          "Not started": 2,
          Completed: 3,
        };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        } else {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
      });

    void setSortedAssignments(
      withStatusAndSorted.map((assignment) => ({
        ...assignment,
        isCompleted: false, // or assign the appropriate value
      })),
    );
  }, [assignments]);

  return (
    <div>
      <div className="flex justify-between p-2">
        <Heading color="indigo">{type}</Heading>
        <WithTeacherRole>
          <button onClick={onClickAddButton}>+</button>
        </WithTeacherRole>
      </div>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="font-bold text-lg">
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedAssignments.length > 0 ? (
            sortedAssignments.map((assignment) => (
              <Table.Row
                key={assignment.id}
                className="cursor-pointer"
                onClick={() => onClickAsessment(assignment.id)}
              >
                <Table.RowHeaderCell>{assignment.name}</Table.RowHeaderCell>
                <Table.Cell>{assignment.startDate}</Table.Cell>
                <Table.Cell>{assignment.dueDate}</Table.Cell>
                <Table.Cell
                  className={`py-2 ${
                    assignment.status === "Completed"
                      ? "text-yellow-500"
                      : assignment.status === "Not started"
                        ? "text-red-500"
                        : "text-green-500"
                  }`}
                >
                  {assignment.status}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center text-lg">
                There is no {type}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default AssessmentTable;
