import { CreateDriveFolderRequest, CreateDriveFolderResponse } from "@/apis";
import { newDriveFolder } from "@/data/drive";

// createDriveFolder implements the createDriveFolder endpoint.
export const createDriveFolder = async (
  ctx: any,
  request: CreateDriveFolderRequest,
): Promise<CreateDriveFolderResponse> => {
  const { newFolderName, parentFolderID } = request;
  const folderInfo = await newDriveFolder(newFolderName, parentFolderID);
  return { folderInfo };
};
