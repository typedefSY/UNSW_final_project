import { SubmitAssignmentRequest, SubmitAssignmentResponse } from "@/apis";
import { submitAssignment as submitAssignmentData } from "@/data/assessment";
import { formatSubmission as formatSubmissionResponse } from "@/converts/assessment";
import { APIError } from "@/apis";
import { useCurrentUser } from "@/context/auth";

// submitAssignment implements the submitAssignment endpoint.
export const submitAssignment = async (
  ctx: any,
  request: SubmitAssignmentRequest,
): Promise<SubmitAssignmentResponse> => {
  try {
    const user = useCurrentUser(ctx)!;
    const submission = await submitAssignmentData(request, user);

    return { submission: formatSubmissionResponse(submission) };
  } catch (error) {
    console.error("Error in submitAssignment handler:", error);

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError("Failed to submit assignment", "SUBMISSION_ERROR");
  }
};
