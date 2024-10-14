import { AddDriveItemRequest, AddDriveItemResponse, DriveItem } from "@/apis";
import { addDriveFile } from "@/data/drive";

// addDriveItem implements the addDriveItem endpoint.
export const addDriveItem = async (
  ctx: any,
  request: AddDriveItemRequest,
): Promise<AddDriveItemResponse> => {
  const { url, name, folderID } = request;
  const fileID = await addDriveFile(url, name, folderID);
  const item: DriveItem = {
    id: fileID,
    name,
    url,
  };
  return { item };
};
