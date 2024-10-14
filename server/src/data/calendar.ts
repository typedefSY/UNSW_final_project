import { db } from "@/globals";
import { Course, Assessment } from "@prisma/client";
import { APIError } from "@/apis";
import { Event, ScheduleClass } from "@/apis";
import { getRoleInCourse } from "@/data/course";

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  return `${hours}:${minutesStr} ${ampm}`;
}

export const fetchAllEventByCourse = async (
  courseId: string,
): Promise<Record<string, Event[]>> => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new APIError("Course not found", "COURSE_NOT_FOUND");
  }

  const events: Record<string, Event[]> = {};

  const classes = await db.scheduleClass.findMany({
    where: {
      courseID: courseId,
    },
    include: {
      course: {
        select: {
          name: true, // Only include the name field from the Course model
        },
      },
    },
  });

  for (const scheduleClass of classes) {
    const key = scheduleClass.startDate.toISOString().split("T")[0]!;
    if (!events[key]) {
      events[key] = [];
    }
    events[key]?.push({
      name: `${scheduleClass.course.name} ${scheduleClass.type} class`,
      time: formatTime(scheduleClass.startDate),
      type: scheduleClass.type,
      url: scheduleClass.url,
    });
  }

  const assessments = await db.assessment.findMany({
    where: {
      courseID: courseId,
    },
  });

  for (const assessment of assessments) {
    if (!assessment.dueDate) {
      continue;
    }
    const key = assessment.dueDate.toISOString().split("T")[0]!;
    if (!events[key]) {
      events[key] = [];
    }
    events[key]?.push({
      name: `${assessment.title} is due (${course.name})`,
      time: formatTime(assessment.dueDate),
      type: assessment.type,
      url:
        assessment.type === "exam"
          ? `/course/${courseId}/exam/${assessment.id}`
          : `/course/${course.id}/assignment/${assessment.id}`,
    });
  }

  return events;
};

export const fetchAllEventByUser = async (
  userId: string,
): Promise<Record<string, Event[]>> => {
  const courses = await db.courseMembers.findMany({
    where: {
      userID: userId,
      // role: "STUDENT"
    },
  });

  const events: Record<string, Event[]> = {};
  for (const course of courses) {
    const courseEvents = await fetchAllEventByCourse(course.courseID);
    for (const key in courseEvents) {
      if (!events[key]) {
        events[key] = [];
      }
      for (const event of courseEvents[key]!) {
        events[key]!.push(event);
      }
    }
  }
  return events;
};

export const createScheduleClass = async (
  userId: string,
  scheduleClass: ScheduleClass,
): Promise<void> => {
  const role = await getRoleInCourse(userId, scheduleClass.courseID);
  if (role !== "TEACHER") {
    throw new APIError(
      "You are not authorized to add a schedule class to this course.",
    );
  }
  db.scheduleClass
    .create({
      data: {
        url: scheduleClass.classLink,
        startDate: new Date(scheduleClass.startDate),
        courseID: scheduleClass.courseID,
        type: scheduleClass.classType,
      },
    })
    .catch((error) => {
      throw new APIError(error.message, "SCHEDULE_CLASS_CREATION_FAILED");
    });
};
