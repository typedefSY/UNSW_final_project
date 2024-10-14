import React, { useCallback } from "react";
import { Card, Text, Box, Badge, Inset, Strong } from "@radix-ui/themes";
import { Course } from "@/backend";
import defaultCourseImg from "@/assets/unsw.png";

export type CourseCardProps = {
  course: Course;
  onClick?: (course: Course) => void;
  role?: string;
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  role,
  onClick,
}) => {
  const { description, imageURL, name } = course;

  const onClickInner = useCallback(() => {
    onClick?.(course);
  }, [course, onClick]);

  return (
    <Box maxWidth="240px">
      <Card
        className="
          overflow-hidden
          max-w-sm
          transform
          cursor-pointer
          w-[240px]
          h-[280px]"
        onClick={onClickInner}
      >
        {/* Header Image */}
        <Inset clip="padding-box" side="top" pb="current">
          <img
            src={imageURL ?? defaultCourseImg.src}
            alt="Course"
            className="object-cover h-[130px] w-full"
          />
        </Inset>

        {/* Content */}
        <div className="flex flex-col justify-between h-1/2">
          {/* Course Name and Description */}
          <Box className="mt-2">
            {/* Course Name */}
            <div>
              <Text trim="both" size="2" className="font-bold line-clamp-1">
                <Strong>{name}</Strong>
              </Text>
            </div>
            {/* Description */}
            <div className="mt-3">
              <Text
                size="1"
                trim="both"
                className="text-sm text-gray-600 line-clamp-3"
              >
                {description}
              </Text>
            </div>
          </Box>
          {role && (
            <Badge size="1" className="mt-4 w-fit">
              {role}
            </Badge>
          )}
        </div>
      </Card>
    </Box>
  );
};
