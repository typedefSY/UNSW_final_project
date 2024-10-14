import { Button, TextArea, TextField } from "@radix-ui/themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdDriveFolderUpload } from "react-icons/md";

export interface CourseMetadata {
  name: string;
  description: string;
  code?: string;
  imageURL?: string;
}

export const CourseMetadataForm: React.FC<{
  metadata: CourseMetadata;
  onChangeMetadata: (meta: CourseMetadata) => void;
  doneButtonLabel?: string;
  onClickDone: (meta: CourseMetadata) => void;
  isLoading?: boolean;
}> = ({
  metadata,
  onChangeMetadata,
  doneButtonLabel = "Create",
  onClickDone,
  isLoading,
}) => {
  const onClickDoneInner = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onClickDone(metadata);
    },
    [metadata, onClickDone],
  );

  const [file, setFile] = useState<File | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const metadataRef = useRef(metadata);

  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);

  const uploadImage = useCallback(async () => {
    if (!file) {
      return;
    }
    onChangeMetadata({ ...metadataRef.current, imageURL: undefined });
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (res.status !== 200) {
      throw new Error(`Error uploading image. Please try again.`);
    }

    const data = await res.text();
    // [{src: "/file/336108d21bbfd31465bbd.png"}]
    const url = `https://img.xvv.net${JSON.parse(data)[0].src}`;

    onChangeMetadata({ ...metadataRef.current, imageURL: url });

    setIsUploadingImage(false);

    setFile(null);
  }, [file, onChangeMetadata]);

  useEffect(() => {
    if (file) {
      void uploadImage();
    }
  }, [file, uploadImage]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="courseName" className="block text-md font-medium">
          Course Name
        </label>
        <TextField.Root
          value={metadata.name}
          onChange={(e) => {
            onChangeMetadata({ ...metadata, name: e.target.value });
          }}
          placeholder="Enter course name"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="courseName" className="block text-md font-medium">
          Course Code
        </label>
        <TextField.Root
          value={metadata.code}
          onChange={(e) => {
            onChangeMetadata({ ...metadata, code: e.target.value });
          }}
          placeholder="Short name for your course"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="courseDescription"
          className="block text-md font-medium"
        >
          Course Description
        </label>

        <TextArea
          value={metadata.description}
          onChange={(e) => {
            onChangeMetadata({ ...metadata, description: e.target.value });
          }}
          placeholder="Enter course description"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="courseName" className="block text-md font-medium">
          Image
        </label>

        {file && <div>Uploading {file.name}...</div>}

        {metadata.imageURL && (
          <>
            <div className="w-full h-auto object-contain">
              <img src={metadata.imageURL} alt="Course Image" />
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          {metadata.imageURL && (
            <Button
              color="red"
              variant="soft"
              size="3"
              onClick={() => {
                setFile(null);
                onChangeMetadata({ ...metadata, imageURL: undefined });
              }}
            >
              Remove
            </Button>
          )}
          {!file && (
            <Button
              color="indigo"
              variant="soft"
              size="3"
              onClick={handleUploadClick}
            >
              <MdDriveFolderUpload size={20} />{" "}
              {metadata.imageURL ? "Change" : "Upload"}
            </Button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
              setFile(files[0]!);
            }
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="solid"
          type="submit"
          size={"3"}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          disabled={isLoading || isUploadingImage}
          onClick={onClickDoneInner}
        >
          {doneButtonLabel}
        </Button>
      </div>
    </div>
  );
};
