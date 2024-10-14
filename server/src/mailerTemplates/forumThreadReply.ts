import { Course, Post, Thread, User } from "@prisma/client";
import { generalEmail, generalEmailWithSubject } from "./general";
import { EmailGenerator } from "@/data/mailer";
import { FRONTEND_ADDRESS } from "@/globals";
import { generateHTMLFromTiptap } from "@/utils/tiptapHTML";
import { JSONContent } from "@tiptap/core";

interface ThreadReplyEmail {
  title: string;
  course: Course;
  sender: User;
  recipient: User;

  thread: Thread;
  post: Post;
}

export const threadReplyEmail: EmailGenerator<ThreadReplyEmail> = async ({
  course,
  title,
  recipient,
  sender,
  post,
  thread,
}) => {
  return generalEmailWithSubject({
    subject: `You have a new reply in ${thread.title}`,
    title: `[${course.code ?? course.name}] ${thread.title}`,
    name: recipient.firstName,
    content: `<b>${sender.firstName} ${sender.lastName}</b> has replied to <b>${
      thread.title
    }</b> in <b>${course.name}</b>:

  <hr>
  ${
    post.content
      ? generateHTMLFromTiptap(post.content as JSONContent)
      : "(no preview is available)"
  }
  <hr>

You can reply to this thread <a href="${FRONTEND_ADDRESS}/course/${
      course.id
    }/forum?thread=${thread.id}">here</a>.

If you do not wish to receive these kinds of emails, update your notification settings on your profile page.`,
    senderName: "BrainWaveBuilder",
  });
};
