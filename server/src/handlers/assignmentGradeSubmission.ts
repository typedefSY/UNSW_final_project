import {
  AssignmentGradeSubmissionRequest,
  AssignmentGradeSubmissionResponse,
  APIError,
} from "@/apis";
import { assignmentGradeSubmission as assignmentGradeSubmissionData } from "@/data/assessment";
import { formatSubmission as formatSubmissionResponse } from "@/converts/assessment";

// assignmentGradeSubmission implements the assignmentGradeSubmission endpoint.
export const assignmentGradeSubmission = async (
  ctx: any,
  request: AssignmentGradeSubmissionRequest,
): Promise<AssignmentGradeSubmissionResponse> => {
  try {
    const updatedSubmission = await assignmentGradeSubmissionData(request);

    return { submission: formatSubmissionResponse(updatedSubmission) };
  } catch (error) {
    console.error("Error in assignmentGradeSubmission handler:", error);

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      "Failed to grade assignment submission",
      "ASSIGNMENT_GRADING_FAILED",
    );
  }
};
