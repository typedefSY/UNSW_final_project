import {
  FetchAssessmentDetailsStudentRequest,
  FetchAssessmentDetailsStudentResponse,
  APIError,
} from "@/apis";
import { fetchAssessmentDetails as fetchDetailsFromDB } from "@/data/assessment";
import { formatAssessmentForStudent } from "@/converts/assessment";

// fetchAssessmentDetailsStudent implements the fetchAssessmentDetailsStudent endpoint.
export const fetchAssessmentDetailsStudent = async (
  ctx: any,
  request: FetchAssessmentDetailsStudentRequest,
): Promise<FetchAssessmentDetailsStudentResponse> => {
  try {
    const assessmentDetails = await fetchDetailsFromDB(request);

    return { assessment: formatAssessmentForStudent(assessmentDetails) };
  } catch (error) {
    console.error("Error in fetchAssessmentDetailsStudent handler:", error);

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      "Failed to fetch assessment details",
      "FETCH_ASSESSMENT_STUDENT_DETAILS_FAILED",
    );
  }
};
