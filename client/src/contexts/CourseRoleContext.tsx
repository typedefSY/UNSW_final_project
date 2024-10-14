import { createContext, useContext } from "react";

export const useRoleInCourse = () => {
  const role = useContext(CourseRoleContext);

  if (role === null) throw new Error("Cannot use role outside of role context");

  return role;
};

export const isTeacher = (role: string) => role === "TEACHER";
export const isStudent = (role: string) => role === "STUDENT";

export const CourseRoleContext = createContext<string | null>(null);

export const WithTeacherRole: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const role = useRoleInCourse();

  if (!isTeacher(role)) return null;

  return <>{children}</>;
};

export const WithStudentRole: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const role = useRoleInCourse();

  if (!isStudent(role)) return null;

  return <>{children}</>;
};

export const WithNoRole: React.FC<React.PropsWithChildren> = ({ children }) => {
  const role = useRoleInCourse();

  if (role) return null;

  return <>{children}</>;
};
