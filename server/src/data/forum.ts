import {
  ForumWithCreatedBy,
  PostWithCreatedBy,
  ThreadWithPostsAndCounts,
} from "@/converts/forum";
import { db } from "@/globals";
import {
  Course,
  Forum,
  Post,
  PostLikes,
  Thread,
  ThreadViews,
} from "@prisma/client";
import { CourseWithCreatedBy } from "./course";

export const createForum = async (
  createdByID: string,
  courseID: string,
  name: string,
): Promise<Forum> => {
  const forum = await db.forum.create({
    data: {
      courseID,
      name,
      createdByID,
      createdAt: new Date(),
    },
  });

  return forum;
};

export const getForumByCourseID = async (
  courseID: string,
): Promise<ForumWithCreatedBy | null> => {
  const forum = await db.forum.findUnique({
    where: {
      courseID,
    },
    include: {
      createdBy: true,
    },
  });

  return forum;
};

export const getForumsByCourseIDs = async (
  courseIDs: string[],
): Promise<ForumWithCreatedBy[]> => {
  const forum = await db.forum.findMany({
    where: {
      courseID: {
        in: courseIDs,
      },
    },
    include: {
      createdBy: true,
    },
  });

  return forum;
};

export const getForumByID = async (
  id: string,
): Promise<ForumWithCreatedBy | null> => {
  const forum = await db.forum.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: true,
    },
  });

  return forum;
};

export const getCourseByForumID = async (
  forumID: string,
): Promise<Course | null> => {
  const forum = await db.forum.findUnique({
    where: {
      id: forumID,
    },
    include: {
      course: true,
    },
  });

  return forum?.course ?? null;
};

export const getCoursesByForumIDs = async (
  forumID: string[],
): Promise<CourseWithCreatedBy[]> => {
  const forum = await db.forum.findMany({
    where: {
      id: { in: forumID },
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
    },
  });

  return forum.map((f) => f.course);
};

export const getThreadsByForumID = async (
  forumID: string,
  userID: string,
): Promise<ThreadWithPostsAndCounts[]> => {
  const threads = await db.thread.findMany({
    where: {
      forumID,
      deletedAt: null,
    },
    include: {
      createdBy: true,
      posts: {
        include: {
          createdBy: true,
        },
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return threads;
};

export const deleteThread = async (id: string): Promise<Thread> => {
  return await db.thread.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

interface ThreadUpdatable {
  title: string;
}

interface ThreadCreatable {
  forumID: string;
  title: string;
  createdByID: string;
  isAnnouncement: boolean;
}

export const createThread = async ({
  createdByID,
  forumID,
  title,
  isAnnouncement,
}: ThreadCreatable): Promise<Thread> => {
  return await db.thread.create({
    data: {
      forumID,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByID,
      deletedAt: null,
      isAnnouncement,
    },
  });
};

export const updateThread = async (
  id: string,
  thread: ThreadUpdatable,
): Promise<Thread> => {
  return await db.thread.update({
    where: {
      id,
    },
    data: {
      title: thread.title,
      updatedAt: new Date(),
    },
  });
};

interface PostUpdatable {
  content: string;
}

interface PostCreatable {
  threadID: string;
  content: string;
  createdByID: string;
}

export const createPost = async ({
  createdByID,
  threadID,
  content,
}: PostCreatable): Promise<Post> => {
  return await db.post.create({
    data: {
      threadID,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdByID: createdByID,
      deletedAt: null,
    },
  });
};

export const updatePost = async (
  id: string,
  post: PostUpdatable,
): Promise<Post> => {
  return await db.post.update({
    where: {
      id,
    },
    data: {
      content: post.content,
      updatedAt: new Date(),
    },
  });
};

export const deletePost = async (id: string): Promise<Post> => {
  return await db.post.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const getThreadByID = async (
  id: string,
): Promise<ThreadWithPostsAndCounts | null> => {
  const thread = await db.thread.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: true,
      posts: {
        include: {
          createdBy: true,
        },
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return thread;
};

export const getPostByID = async (
  id: string,
): Promise<PostWithCreatedBy | null> => {
  const post = await db.post.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: true,
    },
  });

  return post;
};

export const incrementView = async (
  threadID: string,
  userID: string,
): Promise<void> => {
  await db.threadViews.create({
    data: {
      threadID,
      userID,
      viewedAt: new Date(),
    },
  });
};

export const getThreadViews = async (
  threadID: string,
): Promise<ThreadViews[]> => {
  const threadViews = await db.threadViews.findMany({
    where: {
      threadID,
    },
  });

  return threadViews;
};

export const getPostsReactions = async (
  postIDs: string[],
): Promise<PostLikes[]> => {
  const postLikes = await db.postLikes.findMany({
    where: {
      postID: {
        in: postIDs,
      },
    },
  });

  return postLikes;
};

export const getPostIDsByThreadID = async (
  threadID: string,
): Promise<string[]> => {
  const posts = await db.post.findMany({
    where: {
      threadID,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  return posts.map((p) => p.id);
};

export const toggleLikePost = async (
  postID: string,
  userID: string,
): Promise<boolean> => {
  const existingLike = await db.postLikes.findUnique({
    where: {
      postID_userID: {
        postID,
        userID,
      },
    },
  });

  if (existingLike) {
    await db.postLikes.delete({
      where: {
        postID_userID: {
          postID,
          userID,
        },
      },
    });

    return false;
  }

  await db.postLikes.create({
    data: {
      postID,
      userID,
    },
  });

  return true;
};

export const getAnnouncements = async (
  forumIDs: string[],
): Promise<ThreadWithPostsAndCounts[]> => {
  const threads = await db.thread.findMany({
    where: {
      forumID: {
        in: forumIDs,
      },
      isAnnouncement: true,
    },
    include: {
      posts: {
        include: {
          createdBy: true,
        },
      },
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return threads;
};

export const mapThreadIDsToCourses = async (
  threadIDs: string[],
): Promise<Record<string, CourseWithCreatedBy>> => {
  const threadToCourses: Record<string, CourseWithCreatedBy> = {};

  const threads = await db.thread.findMany({
    where: {
      id: {
        in: threadIDs,
      },
    },
    include: {
      forum: {
        include: {
          course: {
            include: {
              createdBy: true,
            },
          },
        },
      },
    },
  });

  threads.forEach((t) => {
    threadToCourses[t.id] = t.forum.course;
  });

  return threadToCourses;
};
