import { SubmitAnswersRequest, SubmitAnswersResponse } from "@/apis";
import { submitAnswers as submitAnswersData } from "@/data/assessment"; // Adjust path as necessary
import { formatSubmission as formatSubmissionResponse } from "@/converts/assessment"; // A hypothetical function to format response
import { APIError } from "@/apis";
import { useCurrentUser } from "@/context/auth";

// submitAnswers implements the submitAnswers endpoint.

export const submitAnswers = async (
  ctx: any,
  request: SubmitAnswersRequest,
): Promise<SubmitAnswersResponse> => {
  try {
    const user = useCurrentUser(ctx)!;
    const submission = await submitAnswersData(request, user);

    return { submission: formatSubmissionResponse(submission) };
  } catch (error) {
    console.error("Error in submitAnswers handler:", error);

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError("Failed to submit answers", "SUBMISSION_ERROR");
  }
};
