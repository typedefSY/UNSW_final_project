import {
  FetchSubmissionRequest,
  FetchSubmissionResponse,
  APIError,
} from "@/apis";
import { fetchSubmission as fetchSubmissionData } from "@/data/assessment";
import { formatSubmission } from "@/converts/assessment";

// fetchSubmission implements the fetchSubmission endpoint.
export const fetchSubmission = async (
  ctx: any,
  request: FetchSubmissionRequest,
): Promise<FetchSubmissionResponse> => {
  try {
    const submission = await fetchSubmissionData(request);
    const formattedSubmission = formatSubmission(submission);
    return { submission: formattedSubmission };
  } catch (error) {
    console.error("Error in fetchSubmission handler:", error);
    throw new APIError("Failed to fetch submission", "FETCH_ERROR");
  }
};
