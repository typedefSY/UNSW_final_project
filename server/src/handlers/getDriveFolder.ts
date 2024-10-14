import { GetDriveFolderRequest, GetDriveFolderResponse } from "@/apis";
import { getDriveFolderByID } from "@/data/drive";

// getDriveFolder implements the getDriveFolder endpoint.
export const getDriveFolder = async (
  ctx: any,
  request: GetDriveFolderRequest,
): Promise<GetDriveFolderResponse> => {
  const { folderID } = request;
  const folder = await getDriveFolderByID(folderID);
  return { folder };
};
