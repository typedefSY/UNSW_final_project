import {
  FetchAssessmentSubmissionsRequest,
  FetchAssessmentSubmissionsResponse,
  APIError,
} from "@/apis";
import { fetchAssessmentSubmissions as fetchSubmissionsData } from "@/data/assessment";
import { formatSubmission } from "@/converts/assessment";

// fetchAssessmentSubmissions implements the fetchAssessmentSubmissions endpoint.
export const fetchAssessmentSubmissions = async (
  ctx: any,
  request: FetchAssessmentSubmissionsRequest,
): Promise<FetchAssessmentSubmissionsResponse> => {
  try {
    const submissions = await fetchSubmissionsData(request);
    const formattedSubmissions = submissions.map((submission) =>
      formatSubmission(submission),
    );
    return { submissions: formattedSubmissions };
  } catch (error) {
    console.error("Error in fetchAssessmentSubmissions handler:", error);
    throw new APIError("Failed to fetch submissions", "FETCH_ERROR");
  }
};
