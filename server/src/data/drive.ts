import { db } from "@/globals";
import { APIError, DriveFolderInfo, DriveItem } from "@/apis";
import { DriveFolder } from "@/apis";

export const newDriveFolder = async (
  name: string,
  parentFolderID: string,
): Promise<DriveFolderInfo> => {
  const folder = await db.folder.create({
    data: {
      name,
      parentID: parentFolderID,
    },
  });
  return {
    id: folder.id,
    name: folder.name,
  };
};

export const addDriveFile = async (
  url: string,
  name: string,
  folderID: string,
): Promise<string> => {
  const file = await db.files.create({
    data: {
      url,
      name,
      folderId: folderID,
    },
  });
  return file.id;
};

export const getDriveFolderByID = async (
  folderID: string,
): Promise<DriveFolder> => {
  const folder = await db.folder.findUnique({
    where: {
      id: folderID,
    },
  });
  if (!folder) {
    throw new APIError("Folder not found.");
  }
  const items: Array<DriveItem | DriveFolderInfo> = [];
  const files = await db.files.findMany({
    where: {
      folderId: folderID,
    },
  });
  for (const file of files) {
    items.push({
      id: file.id,
      name: file.name,
      url: file.url,
    });
  }
  const folders = await db.folder.findMany({
    where: {
      parentID: folderID,
    },
  });
  for (const subfolder of folders) {
    items.push({
      id: subfolder.id,
      name: subfolder.name,
    });
  }
  const driveFolder: DriveFolder = {
    parentFolderId: folder.parentID ?? undefined,
    id: folder.id,
    name: folder.name,
    items,
  };
  return driveFolder;
};
