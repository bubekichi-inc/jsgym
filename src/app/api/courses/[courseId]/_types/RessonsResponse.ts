export type Lesson = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LessonsResponse = {
  lessons: Lesson[];
  course: {
    id: number;
    name: string;
  };
};
