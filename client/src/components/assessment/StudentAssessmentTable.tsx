import React, { useState, useEffect } from "react";
import { Heading } from "@radix-ui/themes";
import { Table } from "@radix-ui/themes";
import { useBackend } from "@/hooks/useBackend";
import { Submission } from "@/backend";

interface AssignmentProps {
  id: string;
  name: string;
  startDate: string;
  dueDate: string;
  totalPoints: number;
}

interface AssignmentWithStatusAndSubmission extends AssignmentProps {
  status: "Not Start" | "In Progress" | "Completed";
  submissionId?: string;
  grade?: string;
}

interface AssignmentsTableProps {
  assignments: AssignmentProps[];
  type: string;
  onClickAsessment: (assessmentId: string) => void;
  viewAssignmentResult: (submissionId: string) => void;
}

// Component to display a table of assignments
const StudentAssesmentTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  type,
  onClickAsessment,
  viewAssignmentResult,
}) => {
  const [sortedAssignments, setSortedAssignments] = useState<
    AssignmentWithStatusAndSubmission[]
  >([]);
  const backend = useBackend();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchSubmissionsAndMapToAssignments = async () => {
      let submissionsMap: Record<string, Submission> = {};

      try {
        const { submissions } = await backend.fetchStudentSubmission({});
        submissionsMap = submissions.reduce(
          (acc: Record<string, Submission>, sub: Submission) => {
            acc[sub.assessmentId] = sub;
            return acc;
          },
          {} as Record<string, Submission>,
        );
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }

      const withSubmissions = assignments.map((assignment) => {
        const submission = submissionsMap[assignment.id];

        return {
          ...assignment,
          startDate: formatDate(assignment.startDate),
          dueDate: formatDate(assignment.dueDate),
          submissionId: submission?.id,
          grade: submission?.isMarked
            ? `${submission.grade}/${assignment.totalPoints}`
            : "Not Graded",
          status: determineStatus(assignment, new Date(), submission?.id),
        };
      });

      setSortedAssignments(withSubmissions);
    };

    void fetchSubmissionsAndMapToAssignments();
  }, [assignments, backend]);

  const determineStatus = (
    assignment: AssignmentProps,
    currentDate: Date,
    submissionId?: string,
  ): "Not Start" | "In Progress" | "Completed" => {
    const start = new Date(assignment.startDate);
    const due = new Date(assignment.dueDate);
    if (currentDate > due) {
      return "Completed";
    } else if (currentDate < start) {
      return "Not Start";
    } else if (submissionId!) {
      return "Completed";
    } else {
      return "In Progress";
    }
  };

  const handleRowClick = (
    id: string,
    status: string,
    submissionId?: string,
  ) => {
    if (type === "Assignment" && status === "Completed" && submissionId) {
      viewAssignmentResult(submissionId);
    } else if (
      type === "Assignment" &&
      status !== "Not Start" &&
      !submissionId
    ) {
      onClickAsessment(id);
    } else if (type === "Exam" && status === "In Progress" && !submissionId) {
      onClickAsessment(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between p-2">
        <Heading color="indigo">{type}</Heading>
      </div>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row className="font-bold text-lg">
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Grade</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedAssignments.length > 0 ? (
            sortedAssignments.map((assignment) => (
              <Table.Row
                key={assignment.id}
                className={`${
                  (type === "Assignment" &&
                    assignment.status !== "Not Start") ||
                  (type === "Exam" && assignment.status === "In Progress")
                    ? "cursor-pointer"
                    : ""
                }`}
                onClick={() =>
                  handleRowClick(
                    assignment.id,
                    assignment.status,
                    assignment.submissionId,
                  )
                }
              >
                <Table.RowHeaderCell>{assignment.name}</Table.RowHeaderCell>
                <Table.Cell>{assignment.startDate}</Table.Cell>
                <Table.Cell>{assignment.dueDate}</Table.Cell>
                <Table.Cell
                  className={`py-2 ${
                    assignment.status === "Completed"
                      ? "text-yellow-500"
                      : assignment.status === "Not Start"
                        ? "text-red-500"
                        : "text-green-500"
                  }`}
                >
                  {assignment.status}
                </Table.Cell>
                <Table.Cell>
                  {assignment.grade ? assignment.grade : "Not Graded"}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center text-lg">
                There is no {type}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default StudentAssesmentTable;
