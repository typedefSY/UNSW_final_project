import {
  FetchAssessmentsRequest,
  FetchAssessmentsResponse,
  APIError,
} from "@/apis";
import { fetchAssessments as fetchAssessmentsData } from "@/data/assessment";
import { formatAssessment } from "@/converts/assessment";

// fetchAssessments implements the fetchAssessments endpoint.
export const fetchAssessments = async (
  ctx: any,
  request: FetchAssessmentsRequest,
): Promise<FetchAssessmentsResponse> => {
  try {
    const assessments = await fetchAssessmentsData(request);
    const formattedAssessments = assessments.map((assessment) =>
      formatAssessment(assessment),
    );
    return { assessments: formattedAssessments };
  } catch (error) {
    console.error("Error in fetchAssessments handler:", error);
    throw new APIError("Failed to fetch assessments", "FETCH_ERROR");
  }
};
