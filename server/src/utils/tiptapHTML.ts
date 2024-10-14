import { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";

import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";

//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder;
const tiptapLink = Link.configure({
  HTMLAttributes: {
    class:
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
  },
});

const tiptapImage = Image.configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border border-muted",
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2",
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "flex gap-2 items-start my-4",
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: "mt-4 mb-6 border-t border-muted-foreground",
  },
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: "list-disc list-outside leading-3 -mt-2",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3 -mt-2",
    },
  },
  listItem: {
    HTMLAttributes: {
      class: "leading-normal -mb-2",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "border-l-4 border-primary",
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class:
        "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",
    },
  },
  code: {
    HTMLAttributes: {
      class: "rounded-md bg-muted  px-1.5 py-1 font-mono font-medium",
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  taskList,
  taskItem,
  horizontalRule,
  TextStyle,
];

export const generateHTMLFromTiptap = (doc: JSONContent) => {
  return generateHTML(doc, defaultExtensions);
};
