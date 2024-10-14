import { APIError } from "@/apis";
import { db } from "@/globals";
import {
  CourseInvitations,
  CourseMembers,
  CourseRole,
  Prisma,
} from "@prisma/client";

export type CourseWithCreatedBy = Prisma.CourseGetPayload<{
  include: {
    createdBy: true;
  };
}>;

export const getCoursesByIDs = async (
  ids: string[],
): Promise<CourseWithCreatedBy[] | null> => {
  ids = [...new Set(ids)];

  const courses = await db.course.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      createdBy: true,
    },
  });

  if (courses.length !== ids.length) return null;

  return courses;
};

export const getCourseByID = async (
  id: string,
): Promise<CourseWithCreatedBy | null> => {
  const course = await db.course.findUnique({
    where: {
      id: id,
    },
    include: {
      createdBy: true,
    },
  });

  return course;
};

export const updateCourse = async ({
  description,
  id,
  code,
  imageURL,
  name,
}: {
  description: string;
  id: string;
  name: string;
  code?: string;
  imageURL?: string;
}) => {
  const course = await db.course.update({
    where: {
      id: id,
    },
    data: {
      description,
      name,
      code: code ?? null,
      imageURL: imageURL ?? null,
    },
  });

  return course;
};

export const hasCourse = async (id: string): Promise<boolean> => {
  const course = await getCourseByID(id);
  return course !== null;
};

export interface CreateCourseRequest {
  name: string;
  description: string;
  createdByID: string;
  code?: string;
  imageURL?: string;
}

export const createCourse = async ({
  name,
  description,
  createdByID,
  code,
  imageURL,
}: CreateCourseRequest): Promise<CourseWithCreatedBy> => {
  const course = await db.course.create({
    data: {
      name,
      description,
      createdByID: createdByID,
      code,
      imageURL,
      createdAt: new Date(),
    },
    include: {
      createdBy: true,
    },
  });

  // create drive folder for course
  await db.folder.create({
    data: {
      name: course.name,
      id: course.id,
    },
  });

  return course;
};

export const getUserCourseMembership = async (
  userID: string,
): Promise<CourseMembers[]> => {
  const memberships = await db.courseMembers.findMany({
    where: {
      userID: userID,
    },
  });

  return memberships;
};

export const joinCourse = async (
  userID: string,
  courseID: string,
  role: CourseRole,
): Promise<void> => {
  if (!courseID || !userID || !role)
    throw new APIError("Not all arguments have been provided.");

  await db.$transaction(async (db) => {
    await db.courseMembers.deleteMany({
      where: {
        userID: userID || "",
        courseID: courseID || "",
      },
    });

    await db.courseMembers.create({
      data: {
        userID: userID,
        courseID: courseID,
        role: role,
      },
    });
  });

  return;
};

export const leaveCourse = async (userID: string, courseID: string) => {
  if (!courseID || !userID)
    throw new APIError("Not all arguments have been provided.");

  await db.courseMembers.deleteMany({
    where: {
      userID: userID,
      courseID: courseID,
    },
  });

  return;
};

function generateCode() {
  let code = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

export const createInvitation = async (
  courseID: string,
  createdByID: string,
  role: CourseRole,
): Promise<string> => {
  const secret = generateCode();

  await db.courseInvitations.create({
    data: {
      courseID,
      createdByID,
      createdAt: new Date(),
      role,
      secret,
      // Expires in 7 days
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return secret;
};

export const getCourseMemberships = async (
  courseID: string,
): Promise<CourseMembers[]> => {
  const memberships = await db.courseMembers.findMany({
    where: {
      courseID: courseID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return memberships;
};

export const getRoleInCourse = async (
  userID: string,
  courseID: string,
): Promise<CourseRole | null> => {
  const membership = await db.courseMembers.findFirst({
    where: {
      userID: userID,
      courseID: courseID,
    },
  });

  return membership?.role ?? null;
};

export const isMemberOfCourse = async (
  userID: string,
  courseID: string,
): Promise<boolean> => {
  const membership = await db.courseMembers.findFirst({
    where: {
      userID: userID,
      courseID: courseID,
    },
  });

  return membership !== null;
};

export const getInvitation = async (
  secret: string,
): Promise<CourseInvitations | null> => {
  const invitation = await db.courseInvitations.findUnique({
    where: {
      secret,
    },
  });

  return invitation;
};

export const mapCourseRoleString = (role: string): CourseRole => {
  if (role === "TEACHER") {
    return CourseRole.TEACHER;
  } else if (role === "STUDENT") {
    return CourseRole.STUDENT;
  } else {
    throw new APIError("Invalid role.");
  }
};
