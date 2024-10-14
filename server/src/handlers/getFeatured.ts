import { GetFeaturedRequest, GetFeaturedResponse } from "@/apis";

// getFeatured implements the getFeatured endpoint.
export const getFeatured = async (
  ctx: any,
  request: GetFeaturedRequest,
): Promise<GetFeaturedResponse> => {
  return {
    featured: {
      background:
        "https://images.unsplash.com/photo-1707327956851-30a531b70cda",
      title:
        "Climate change is killing our coral reefs, and urgent action is required to save them.",
      description:
        "Inspired? Join one of our many open classrooms about Environmental Science to find out.",
    },
  };
};
