import { Forum, Prisma } from "@prisma/client";
import { Forum as ForumAPI, Thread as ThreadAPI } from "@/apis";
import { userDBToAPI } from "./user";

export const forumDBToAPI = (forum: Forum): ForumAPI => {
  return {
    id: forum.id,
    courseID: forum.courseID,
    name: forum.name,
    createdAt: forum.createdAt.getTime(),
  };
};

export type ForumWithCreatedBy = Prisma.ForumGetPayload<{
  include: { createdBy: true };
}>;

export const forumDBToAPIWithCreatedBy = (
  forum: ForumWithCreatedBy,
): ForumAPI => {
  return {
    id: forum.id,
    courseID: forum.courseID,
    name: forum.name,
    createdAt: forum.createdAt.getTime(),
    createdBy: userDBToAPI(forum.createdBy),
  };
};

export type ThreadWithPostsAndCounts = Prisma.ThreadGetPayload<{
  include: {
    posts: {
      include: {
        createdBy: true;
      };
    };
    createdBy: true;
  };
}>;

export const threadWithPostsDBToAPI = (
  thread: ThreadWithPostsAndCounts,
): ThreadAPI => {
  return {
    id: thread.id,
    forumID: thread.forumID,
    createdAt: thread.createdAt.getTime(),
    updatedAt: thread.updatedAt.getTime(),
    createdBy: userDBToAPI(thread.createdBy),
    deletedAt: thread.deletedAt?.getTime(),
    title: thread.title,
    posts: thread.posts.map((post) => postWithCreatedByDBToAPI(post)),
    isAnnouncement: thread.isAnnouncement,
  };
};

export type PostWithCreatedBy = Prisma.PostGetPayload<{
  include: { createdBy: true };
}>;

export const postWithCreatedByDBToAPI = (post: PostWithCreatedBy) => {
  return {
    id: post.id,
    threadID: post.threadID,
    createdAt: post.createdAt.getTime(),
    updatedAt: post.updatedAt.getTime(),
    createdBy: userDBToAPI(post.createdBy),
    deletedAt: post.deletedAt?.getTime(),
    content: post.content,
  };
};
