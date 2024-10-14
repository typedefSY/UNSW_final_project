import { db } from "@/globals";
import { Assessment, Submission, Question, User } from "@prisma/client";
import { APIError } from "@/apis";
import {
  CreateAssessmentRequest,
  SubmitAnswersRequest,
  SubmitAssignmentRequest,
  FetchAssessmentDetailsTeacherRequest as fetchAssessmentDetailsRequest,
  FetchAssessmentSubmissionsRequest,
  FetchSubmissionRequest,
  FetchAssessmentsRequest,
  ManualGradeSubmissionRequest,
  AssignmentGradeSubmissionRequest,
  FetchStudentSubmissionRequest,
} from "@/apis";
import { hasCourse } from "./course";

export const createAssessment = async (
  data: CreateAssessmentRequest,
): Promise<Assessment> => {
  try {
    const courseExists = await hasCourse(data.courseId);

    if (!courseExists) {
      throw new APIError("Course not found", "COURSE_NOT_FOUND");
    }

    const assessment = await db.$transaction(async (transactionalDb) => {
      const createdAssessment = await transactionalDb.assessment.create({
        data: {
          title: data.title,
          description: data.description,
          courseID: data.courseId,
          startDate: data.startDate
            ? new Date(data.startDate + "+10:00")
            : null,
          dueDate: data.dueDate ? new Date(data.dueDate + "+10:00") : null,
          type: data.type,
        },
      });

      let totalPoints = 0;

      if (data.questions && data.questions.length > 0) {
        const questions = await Promise.all(
          data.questions.map((question) =>
            transactionalDb.question.create({
              data: {
                assessmentID: createdAssessment.id,
                title: question.title,
                type: question.type,
                options: JSON.stringify(question.options),
                answer: question.answer,
                points: question.points,
              },
            }),
          ),
        );
        totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

        await transactionalDb.assessment.update({
          where: { id: createdAssessment.id },
          data: { totalPoints: totalPoints },
        });
      }

      return { ...createdAssessment, totalPoints };
    });

    return assessment;
  } catch (error) {
    console.error("Failed to create an assessment:", error);
    throw new APIError("Failed to create an assessment", "CREATION_FAILED");
  }
};

interface StudentAnswer {
  questionId: string;
  answer: string;
}

export const submitAnswers = async (
  data: SubmitAnswersRequest,
  user: User,
): Promise<Submission> => {
  try {
    const assessment = await db.assessment.findUnique({
      where: { id: data.assessmentId },
      include: { questions: true },
    });

    if (!assessment) {
      throw new APIError("Assessment not found", "ASSESSMENT_NOT_FOUND");
    }

    const submission = await db.submission.create({
      data: {
        assessmentID: data.assessmentId,
        studentID: user.id,
        answers: JSON.stringify(data.answers),
        submittedAt: new Date(new Date().getTime() + 10 * 60 * 60 * 1000),
        grade: 0,
        isMarked: false,
      },
    });

    const studentAnswers: StudentAnswer[] = data.answers;
    let totalScore = 0;
    let hasShortAnswer = false;

    assessment.questions.forEach((question) => {
      if (question.type === "short_answer") {
        hasShortAnswer = true;
      }

      const studentAnswerEntry = studentAnswers.find(
        (sa) => sa.questionId === question.id,
      );
      if (question.type === "MCQ" && studentAnswerEntry) {
        const studentAnswer = studentAnswerEntry.answer;
        const correctAnswer = question.answer;

        if (studentAnswer === correctAnswer) {
          totalScore += question.points;
        }
      }
    });

    const isMarked = !hasShortAnswer;

    const updatedSubmission = await db.submission.update({
      where: { id: submission.id },
      data: {
        grade: totalScore,
        isMarked: isMarked,
      },
    });

    return updatedSubmission;
  } catch (error) {
    console.error("Failed to submit answers:", error);
    throw new APIError("Failed to submit answers", "SUBMISSION_FAILED");
  }
};

export interface AssessmentDetails extends Assessment {
  questions: Question[];
  submissions: Submission[];
}

export const submitAssignment = async (
  data: SubmitAssignmentRequest,
  user: User,
): Promise<Submission> => {
  try {
    const assessment = await db.assessment.findUnique({
      where: { id: data.assessmentId },
    });
    if (!assessment || assessment.type !== "assignment") {
      throw new APIError(
        "Invalid assessment type or not found",
        "INVALID_ASSESSMENT",
      );
    }

    const submission = await db.submission.create({
      data: {
        assessmentID: data.assessmentId,
        studentID: user.id,
        assignmentContent: JSON.stringify(data.assignmentContent),
        submittedAt: new Date(new Date().getTime() + 10 * 60 * 60 * 1000),
      },
    });

    return submission;
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    throw new APIError("Failed to submit assignment", "SUBMISSION_FAILED");
  }
};

export const fetchAssessmentDetails = async (
  data: fetchAssessmentDetailsRequest,
): Promise<AssessmentDetails> => {
  try {
    const assessment = await db.assessment.findUnique({
      where: { id: data.assessmentId },
      include: {
        questions: true,
        submissions: true,
      },
    });

    if (!assessment) {
      throw new APIError("Assessment not found", "ASSESSMENT_NOT_FOUND");
    }

    return assessment;
  } catch (error) {
    console.error("Failed to fetch assessment details:", error);
    throw new APIError("Failed to fetch assessment details", "FETCH_FAILED");
  }
};

export const fetchAssessmentSubmissions = async (
  data: FetchAssessmentSubmissionsRequest,
): Promise<Submission[]> => {
  try {
    const submissions = await db.submission.findMany({
      where: { assessmentID: data.assessmentId },
    });

    if (!submissions.length) {
      throw new APIError(
        "No submissions found for this assessment",
        "NO_SUBMISSIONS_FOUND",
      );
    }

    return submissions;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    throw new APIError("Failed to fetch submissions", "FETCH_FAILED");
  }
};

export const fetchSubmission = async (
  data: FetchSubmissionRequest,
): Promise<Submission> => {
  try {
    const submission = await db.submission.findUnique({
      where: { id: data.submissionId },
    });

    if (!submission) {
      throw new APIError("Submission not found", "SUBMISSION_NOT_FOUND");
    }

    if (
      submission.assignmentContent &&
      typeof submission.assignmentContent === "string"
    ) {
      try {
        submission.assignmentContent = JSON.parse(submission.assignmentContent);
      } catch (e) {
        console.error(
          "Failed to parse assignmentContent for submission with ID " +
            data.submissionId +
            ":",
          e,
        );
      }
    }

    return submission;
  } catch (error) {
    console.error(
      "Failed to fetch submission with ID " + data.submissionId + ":",
      error,
    );
    throw new APIError("Failed to fetch submission", "FETCH_FAILED");
  }
};

export const fetchStudentSubmission = async (
  data: FetchStudentSubmissionRequest,
  user: User,
): Promise<Submission[]> => {
  try {
    const submissions = await db.submission.findMany({
      where: { studentID: user.id },
    });

    if (!submissions.length) {
      throw new APIError(
        "No submissions found for this assessment",
        "NO_SUBMISSIONS_FOUND",
      );
    }

    return submissions;
  } catch (error) {
    console.error("Failed to fetch submission with ID " + user.id + ":", error);
    throw new APIError("Failed to fetch submission", "FETCH_FAILED");
  }
};

export const fetchAssessments = async (
  data: FetchAssessmentsRequest,
): Promise<Assessment[]> => {
  try {
    const assessments = await db.assessment.findMany({
      where: { courseID: data.courseId },
    });

    if (!assessments.length) {
      return [];
    }

    return assessments;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    throw new APIError("Failed to fetch submissions", "FETCH_FAILED");
  }
};

export const manualGradeSubmission = async (
  data: ManualGradeSubmissionRequest,
): Promise<Submission> => {
  const { submissionId, saqGrades } = data;

  const submission = await db.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new APIError("Submission not found", "SUBMISSION_NOT_FOUND");
  }

  const newTotalGrade = (submission.grade || 0) + saqGrades;

  const updatedSubmission = await db.submission.update({
    where: { id: submissionId },
    data: {
      grade: newTotalGrade,
      isMarked: true,
    },
  });

  return updatedSubmission;
};

export const assignmentGradeSubmission = async (
  data: AssignmentGradeSubmissionRequest,
): Promise<Submission> => {
  try {
    const { submissionId, grades, feedback } = data;

    const existingSubmission = await db.submission.findUnique({
      where: { id: submissionId },
    });

    if (!existingSubmission) {
      throw new APIError("Submission not found", "SUBMISSION_NOT_FOUND");
    }

    const updatedSubmission = await db.submission.update({
      where: { id: submissionId },
      data: {
        grade: grades,
        feedback: feedback,
        isMarked: true,
      },
    });

    return updatedSubmission;
  } catch (error) {
    console.error("Failed to grade the assignment:", error);
    throw new APIError("Failed to update the submission", "UPDATE_FAILED");
  }
};
