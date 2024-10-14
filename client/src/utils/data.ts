import { type Event } from "@/components/calendar/Calendar";
import { Assessment } from "@/backend";
import { DriveItem } from "@/backend";

export const quizData: Assessment = {
  id: "1",
  title: "Final Exam",
  description:
    "This course aims for students to become proficient in a high-level programming language, C. It also focuses on long-term mental preparedness for programming, including problem-solving, debugging, and testing.",
  courseId: "COMP1522",
  type: "exam",
  startDate: "2024-04-10T00:00:00Z",
  dueDate: "2024-04-16T00:00:00Z",
  questions: [
    {
      assessmentId: "1",
      id: "question1",
      title: "Which city is the capital of France?",
      type: "MCQ",
      options: JSON.stringify(["Paris", "Berlin", "Rome"]),
      points: 5,
    },
    {
      assessmentId: "1",
      id: "question2",
      title: "Explain the process of photosynthesis.",
      type: "SAQ",
      points: 10,
      // No options or correct answer provided for SAQ
    },
    {
      assessmentId: "1",
      id: "question3",
      title: "Which city is the capital of France?",
      type: "MCQ",
      options: JSON.stringify(["Paris", "Berlin", "Rome"]),
      points: 5,
    },
  ],
  submissions: [],
};

export const AssessmentsData: Assessment[] = [
  {
    id: "1",
    title: "Final Exam",
    description:
      "Comprehensive examination for advanced understanding of algorithmic principles.",
    courseId: "ALG201",
    type: "exam",
    startDate: "2024-03-10T00:00:00Z",
    dueDate: "2024-06-12T00:00:00Z",
    questions: [],
    submissions: [],
  },
  {
    id: "2",
    title: "Midterm Project",
    description:
      "Project assessment focusing on the practical application of database management.",
    courseId: "DBM302",
    type: "assignment",
    startDate: "2024-05-01T00:00:00Z",
    dueDate: "2024-05-15T00:00:00Z",
    questions: [],
    submissions: [],
  },
  {
    id: "3",
    title: "Network Security Exam",
    description:
      "Evaluation of students' knowledge in network security protocols and defenses.",
    courseId: "NET400",
    type: "exam",
    startDate: "2024-07-20T00:00:00Z",
    dueDate: "2024-07-22T00:00:00Z",
    questions: [],
    submissions: [],
  },
  {
    id: "4",
    title: "Web Development Assignment",
    description:
      "Practical assignment for building responsive web applications.",
    courseId: "WEB101",
    type: "assignment",
    startDate: "2023-01-05T00:00:00Z",
    dueDate: "2023-01-20T00:00:00Z",
    questions: [],
    submissions: [],
  },
  {
    id: "5",
    title: "Software Engineering Ethics",
    description:
      "Discussion-based assessment on the ethical considerations in software development.",
    courseId: "ETH303",
    type: "exam",
    startDate: "2024-09-10T00:00:00Z",
    dueDate: "2024-09-12T00:00:00Z",
    questions: [],
    submissions: [],
  },
];

export const examData = {
  id: "5",
  title: "Final Exam",
  description:
    "This course aims for students to become proficient in a high-level programming language, C. It also focuses on long-term mental preparedness for programming, including problem-solving, debugging, and testing.",
  courseId: "COMP1522",
  type: "exam",
  startDate: "2024-04-10T00:00:00Z",
  dueDate: "2024-04-12T00:00:00Z",
  questions: [
    {
      assessmentId: "5",
      id: "question1",
      title: "Which city is the capital of France?",
      type: "MCQ",
      options: JSON.stringify(["Paris", "Berlin", "Rome"]),
      answer: "Paris",
      points: 5,
    },
    {
      assessmentId: "5",
      id: "question2",
      title: "Explain the process of photosynthesis.",
      type: "SAQ",
      answer:
        "photosynthesis, the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.",
      points: 10,
    },
    {
      assessmentId: "5",
      id: "question3",
      title: "Explain the process of photosynthesis.",
      type: "SAQ",
      answer:
        "photosynthesis, the process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.",
      points: 10,
    },
  ],
  submissions: [
    {
      id: "xyz1",
      assessmentId: "5",
      studentId: "Steve", // Should be an Id for this part, search student name by Id to get the name
      submittedAt: "2024-05-12T00:00:00Z",
      answers: {
        question1: "Paris",
        question2: "lalalalalala",
        question3: "test",
      },
      grade: 0,
    },
  ],
};

export const examSubmission = {
  id: "xyz1",
  assessmentId: "5",
  studentId: "Steve", // Should be an Id for this part, search student name by Id to get the name
  submittedAt: "2024-05-12T00:00:00Z",
  answers: {
    question1: "Paris",
    question2: "lalalalalala",
    question3: "test",
  },
  grade: 0,
};

export const fakeDriveItem: DriveItem = {
  id: "1",
  url: "https://example.com/file1",
  name: "Example File 1",
};
