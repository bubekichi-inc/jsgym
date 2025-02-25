export const questionNumber = (
  courseName: string,
  lessonId: number,
  questionId: number
) => {
  return `${courseName.charAt(0)}-${lessonId}-${questionId}`;
};
