import React, { useCallback } from "react";
import { Card, Text, Box, Badge, Inset, Strong } from "@radix-ui/themes";
import defaultFolder from "@/assets/folder_icon.png";
import defaultFile from "@/assets/file_icon.png";
import { DriveFolderInfo } from "@/backend";
import { DriveItem } from "@/backend";

export type DriveCardProps = {
  content: DriveFolderInfo | DriveItem;
  previewImg?: string;
  onClick?: (content: DriveFolderInfo | DriveItem) => void;
};

function isDriveItem(content: any): content is DriveItem {
  return "url" in content;
}

function getContentType(content: DriveFolderInfo | DriveItem): string {
  if (isDriveItem(content)) {
    return "File";
  } else {
    return "Folder";
  }
}

export const DriveCard: React.FC<DriveCardProps> = ({
  content,
  previewImg,
  onClick,
}) => {
  const { name } = content;

  const contentType = getContentType(content);

  const onClickInner = useCallback(() => {
    onClick?.(content);
  }, [content, onClick]);

  return (
    <Box width="200px" height="250px">
      <Card
        size="2"
        className="
          overflow-hidden
          max-w-sm
          transform
          cursor-pointer
          h-full"
        onClick={onClickInner}
      >
        {/* Header Image */}
        <Inset clip="padding-box" side="top" pb="current">
          <img
            src={previewImg ?? defaultFolder.src}
            alt={name}
            className={
              contentType === "Folder"
                ? "max-h-28 object-contain w-full"
                : "max-h-28 object-cover w-full"
            }
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // reduce infinite loop
              target.src = defaultFile.src; // set default image
              target.style.objectFit = "contain";
              target.style.width = "100%";
            }}
          />
        </Inset>

        {/* Content */}
        <div className="flex flex-col justify-between h-1/2">
          <Box>
            {/* File/Folder Name */}
            <div>
              <Text trim="both" as="p" size="3">
                <Strong>{name}</Strong>
              </Text>
            </div>
          </Box>
          {contentType === "File" ? (
            <Badge size="1" color="blue" className="mt-4 w-fit">
              {contentType}
            </Badge>
          ) : (
            <Badge size="1" className="mt-4 w-fit">
              {contentType}
            </Badge>
          )}
        </div>
      </Card>
    </Box>
  );
};
