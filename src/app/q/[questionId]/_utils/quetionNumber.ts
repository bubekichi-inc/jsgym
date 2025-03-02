export const questionNumber = (
  courseName: string,
  lessonId: number,
  questionId: string
) => {
  return `${courseName.charAt(0)}-${lessonId}-${questionId}`;
};
