import { Course, Post, Thread, User } from "@prisma/client";
import { generalEmail, generalEmailWithSubject } from "./general";
import { EmailGenerator } from "@/data/mailer";
import { FRONTEND_ADDRESS } from "@/globals";
import { generateHTMLFromTiptap } from "@/utils/tiptapHTML";
import { JSONContent } from "@tiptap/core";

interface ForumAnnouncement {
  title: string;
  course: Course;
  sender: User;
  recipient: User;

  thread: Thread;
  post: Post;
}

export const forumAnnouncementEmail: EmailGenerator<
  ForumAnnouncement
> = async ({ course, title, recipient, sender, post, thread }) => {
  return generalEmailWithSubject({
    subject: `[${course.code ?? course.name}] ${thread.title}`,
    title: `New announcement in ${course.name}`,
    name: recipient.firstName,
    content: `<b>${sender.firstName} ${
      sender.lastName
    }</b> has posted an announcement in <b>${course.name}</b>:

  <hr>
  <h1>${thread.title}</h1>

  ${
    post.content
      ? generateHTMLFromTiptap(post.content as JSONContent)
      : "(no preview is available)"
  }

  <hr>

You can view this announcement <a href="${FRONTEND_ADDRESS}/course/${
      course.id
    }/forum?thread=${thread.id}">here</a>.

You cannot unsubscribe to this email as it is an announcement, unless you quit the course.`,
    senderName: "BrainWaveBuilder",
  });
};
