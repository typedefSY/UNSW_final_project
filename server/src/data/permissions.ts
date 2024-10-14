import { CourseRole, Post, Thread, User } from "@prisma/client";
import {
  getCourseByForumID,
  getForumByID,
  getPostByID,
  getThreadByID,
} from "./forum";
import { getRoleInCourse, isMemberOfCourse } from "./course";

export const canViewForum = async (
  user: User,
  forumID: string,
): Promise<boolean> => {
  const forum = await getForumByID(forumID);

  if (!forum) {
    return false;
  }

  if (!(await isMemberOfCourse(user.id!, forum.courseID))) {
    return false;
  }

  return true;
};

export const canCreateThreadInForum = async (
  user: User,
  forumID: string,
): Promise<boolean> => {
  const forum = await getForumByID(forumID);

  if (!forum) {
    return false;
  }

  if (!(await canViewForum(user, forumID))) {
    return false;
  }

  return true;
};

export const canModifyThread = async (
  user: User,
  threadID: string,
): Promise<boolean> => {
  const thread = await getThreadByID(threadID);

  if (!thread) {
    return false;
  }

  const forum = await getForumByID(thread.forumID);

  if (!forum) {
    return false;
  }

  const role = await getRoleInCourse(user.id!, forum.courseID);

  return thread.createdByID === user.id || role === CourseRole.TEACHER;
};

export const canModifyPost = async (
  user: User,
  postID: string,
): Promise<boolean> => {
  const post = await getPostByID(postID);

  if (!post) {
    return false;
  }

  const thread = await getThreadByID(post.threadID);

  if (!thread) {
    return false;
  }

  const forum = await getForumByID(thread.forumID);

  if (!forum) {
    return false;
  }

  const role = await getRoleInCourse(user.id!, forum.courseID);

  return post.createdByID === user.id || role === CourseRole.TEACHER;
};

export const canCreatePostInThread = async (
  user: User,
  threadID: string,
): Promise<boolean> => {
  const thread = await getThreadByID(threadID);

  if (!thread) {
    return false;
  }

  return canCreateThreadInForum(user, thread.forumID);
};

export const canViewThread = async (
  user: User,
  threadID: string,
): Promise<boolean> => {
  const thread = await getThreadByID(threadID);

  if (!thread) {
    return false;
  }

  return canCreateThreadInForum(user, thread.forumID);
};

export const canViewPost = async (
  user: User,
  postID: string,
): Promise<boolean> => {
  const post = await getPostByID(postID);

  if (!post) {
    return false;
  }

  return canViewThread(user, post.threadID);
};

export const hasTeacherRoleInCourse = async (
  user: User,
  courseID: string,
): Promise<boolean> => {
  const role = await getRoleInCourse(user.id, courseID);

  return role === CourseRole.TEACHER;
};

export const userInCourse = async (
  user: User,
  courseID: string,
): Promise<boolean> => {
  const role = await getRoleInCourse(user.id, courseID);

  return !!role;
};

export const canPublishAnnouncement = async (
  user: User,
  forumID: string,
): Promise<boolean> => {
  const course = await getCourseByForumID(forumID);

  if (!course) {
    return false;
  }

  return hasTeacherRoleInCourse(user, course.id);
};
