import { AdvancedEditor } from "@/components/editor/AdvancedEditor";
import { WithTeacherRole } from "@/contexts/CourseRoleContext";
import { Button, Checkbox, TextField } from "@radix-ui/themes";
import { JSONContent } from "novel";
import { useCallback, useState } from "react";

interface Props {
  onClickCreateThreadAndPost: (
    title: string,
    content: JSONContent,
    attrs: ThreadAttributes,
  ) => void;
  onClickCancel: () => void;
}

export interface ThreadAttributes {
  isAnnouncement: boolean;
}

export const NewThreadDisplay: React.FC<Props> = ({
  onClickCreateThreadAndPost: onClickCreatePost,
  onClickCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [],
  });
  const [isAnnouncement, setIsAnnouncement] = useState(false);

  const onToggleIsAnnouncement = useCallback(() => {
    setIsAnnouncement((prev) => !prev);
  }, []);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
    },
    [],
  );

  const onClickPost = useCallback(() => {
    onClickCreatePost(title, content, { isAnnouncement });
  }, [onClickCreatePost, title, content, isAnnouncement]);

  return (
    <div className="flex flex-col px-4 py-4 space-y-4">
      <div className="text-2xl">Create Thread</div>
      <TextField.Root
        variant="surface"
        size={"3"}
        placeholder="Name the thread"
        value={title}
        onChange={onChangeTitle}
        className="w-full text-2xl"
      />

      <AdvancedEditor
        className="border rounded-md overflow-y-auto overflow-x-hidden max-h-[50vh] border-gray-300 p-12 px-8 sm:px-12"
        value={content}
        setValue={setContent}
      />

      <WithTeacherRole>
        <div
          className="flex items-center space-x-2 select-none"
          onClick={onToggleIsAnnouncement}
        >
          <Checkbox size="3" checked={isAnnouncement} />
          <div>Send as an Announcement</div>
        </div>
      </WithTeacherRole>

      <div className="flex justify-end space-x-2">
        <Button onClick={onClickCancel} variant="surface">
          Cancel
        </Button>
        <Button onClick={onClickPost} variant="solid">
          Post
        </Button>
      </div>
    </div>
  );
};
