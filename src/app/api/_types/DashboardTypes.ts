import {
  UserQuestionStatus,
  CodeReviewResult,
  CourseType,
} from "@prisma/client";

export interface Question {
  id: string;
  title: string;
  content: string;
  inputCode: string;
  outputCode: string;
  template: string;
  exampleAnswer: string;
  lessonId: number;
  questions: {
    tag: {
      id: number;
      name: string;
    };
  }[];
  lesson: {
    id: number;
    name: string;
    courseId: number;
    course: {
      id: number;
      name: CourseType;
    };
  };
}

export interface UserQuestion {
  id: string;
  userId: string;
  status: UserQuestionStatus;
  questionId: string;
  createdAt: string;
  updatedAt: string;
  question: Question;
}

export interface Lesson {
  id: number;
  name: string;
  courseId: number;
  questions: {
    id: string;
    title: string;
    userQuestions: {
      id: string;
      status: UserQuestionStatus;
    }[];
  }[];
}

export interface Course {
  id: number;
  name: CourseType;
  lessons: Lesson[];
}

export interface CodeReviewComment {
  id: string;
  codeReviewId: string;
  targetCode: string;
  message: string;
  level: string | null;
}

export interface CodeReview {
  id: string;
  overview: string;
  result: CodeReviewResult;
  createdAt: string;
  comments: CodeReviewComment[];
  userQuestion: {
    id: string;
    status: UserQuestionStatus;
    question: {
      id: string;
      title: string;
    };
  };
}

export interface PointTransaction {
  id: number;
  userId: string;
  kind: string;
  points: number;
  detail: string | null;
  createdAt: string;
}

export interface DashboardData {
  userQuestions: UserQuestion[];
  courseProgress: Course[];
  pointTransactions: PointTransaction[];
  recentCodeReviews: CodeReview[];
  totalPoints: number;
}
