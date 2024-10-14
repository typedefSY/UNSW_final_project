import { db } from "@/globals";
import { Prisma } from "@prisma/client";

export type CourseBookWithCourseAndTree = Prisma.CourseBookGetPayload<{
  include: {
    course: {
      include: {
        createdBy: true;
      };
    };
    parent: true;
    children: true;
  };
}>;

export const getBookByID = async (
  bookID: string,
): Promise<CourseBookWithCourseAndTree | null> => {
  return db.courseBook.findUnique({
    where: {
      id: bookID,
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
  });
};

export const getBookByIDs = async (
  bookIDs: string[],
): Promise<CourseBookWithCourseAndTree[]> => {
  return db.courseBook.findMany({
    where: {
      id: {
        in: bookIDs,
      },
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getBookByParentIDs = async (
  parentBookIDs: string[],
): Promise<CourseBookWithCourseAndTree[]> => {
  return db.courseBook.findMany({
    where: {
      parentID: {
        in: parentBookIDs,
      },
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getBookByChildIDs = async (
  childBookIDs: string[],
): Promise<CourseBookWithCourseAndTree[]> => {
  return db.courseBook.findMany({
    where: {
      children: {
        some: {
          id: {
            in: childBookIDs,
          },
        },
      },
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const deleteBook = async (bookID: string): Promise<void> => {
  await db.courseBook.delete({
    where: {
      id: bookID,
    },
  });
};

export const getBooksByCourseID = async (
  courseID: string,
): Promise<CourseBookWithCourseAndTree[]> => {
  return db.courseBook.findMany({
    where: {
      courseID,
      parentID: null,
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const createBook = async ({
  courseID,
  title,
  parentID,
  content,
}: {
  courseID: string;
  parentID?: string;
  title: string;
  content: string;
}): Promise<CourseBookWithCourseAndTree> => {
  return db.courseBook.create({
    data: {
      courseID,
      title,
      parentID,
      content,
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
  });
};

export const updateBook = async ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}): Promise<CourseBookWithCourseAndTree> => {
  return db.courseBook.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
    include: {
      course: {
        include: {
          createdBy: true,
        },
      },
      parent: true,
      children: true,
    },
  });
};
