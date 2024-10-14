import {
  CreateAssessmentRequest,
  CreateAssessmentResponse,
  APIError,
} from "@/apis";
import { createAssessment as createAssessmentData } from "@/data/assessment";
import { formatAssessment as formatAssessmentResponse } from "@/converts/assessment";

// createAssessment implements the createAssessment endpoint.
export const createAssessment = async (
  ctx: any,
  request: CreateAssessmentRequest,
): Promise<CreateAssessmentResponse> => {
  validateRequest(request);

  try {
    const assessment = await createAssessmentData(request);

    const formattedAssessment = formatAssessmentResponse(assessment);

    return { assessment: formattedAssessment };
  } catch (error) {
    console.error("Error in createAssessment handler:", error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      "Failed to create assessment",
      "CREATE_ASSIGNMENT_FAILED",
    );
  }
};

function validateRequest(request: CreateAssessmentRequest) {
  if (!request.title || !request.courseId || !request.type) {
    throw new APIError("Missing required fields", "VALIDATION_ERROR");
  }
}
