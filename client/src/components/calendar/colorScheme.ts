export const bgcolors = {
  lecture: "green-50",
  tutorial: "[#ECFEFF]",
  assignment: "pink-50",
  exam: "blue-50",
  default: "gray-50",
};

export const subject_colors = {
  lecture: "green-700",
  tutorial: "[#0E7490]",
  assignment: "pink-600",
  exam: "blue-700",
  default: "gray-700",
};

export const getBgColor = (type: string): string => {
  switch (type) {
    case "lecture":
      return bgcolors.lecture;
    case "tutorial":
      return bgcolors.tutorial;
    case "assignment":
      return bgcolors.assignment;
    case "exam":
      return bgcolors.exam;
    default:
      return bgcolors.default;
  }
};

export const getSubjectColor = (type: string): string => {
  switch (type) {
    case "lecture":
      return subject_colors.lecture;
    case "tutorial":
      return subject_colors.tutorial;
    case "assignment":
      return subject_colors.assignment;
    case "exam":
      return subject_colors.exam;
    default:
      return subject_colors.default;
  }
};
