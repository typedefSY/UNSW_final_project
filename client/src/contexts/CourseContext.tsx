import { Course } from "@/backend";
import { createContext, useContext } from "react";

export const CourseContext = createContext<Course | null>(null);

export const useCourse = () => {
  const course = useContext(CourseContext);

  if (!course) throw new Error("Cannot use course outside of course context");

  return course;
};
