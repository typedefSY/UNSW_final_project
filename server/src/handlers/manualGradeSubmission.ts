import {
  ManualGradeSubmissionRequest,
  ManualGradeSubmissionResponse,
  APIError,
} from "@/apis";
import { manualGradeSubmission as manualGradeSubmissionData } from "@/data/assessment";
import { formatSubmission as formatSubmissionResponse } from "@/converts/assessment";

// manualGradeSubmission implements the manualGradeSubmission endpoint.
export const manualGradeSubmission = async (
  ctx: any,
  request: ManualGradeSubmissionRequest,
): Promise<ManualGradeSubmissionResponse> => {
  try {
    const updatedSubmission = await manualGradeSubmissionData(request);

    return { submission: formatSubmissionResponse(updatedSubmission) };
  } catch (error) {
    console.error("Error in manualGradeSubmission handler:", error);

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      "Failed to grade submission manually",
      "MANUAL_GRADING_FAILED",
    );
  }
};
