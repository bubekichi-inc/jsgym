"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { language } from "@/app/_utils/language";
export const BreadCrumbs: React.FC = () => {
  const pathname = usePathname();
  const pathArray = pathname.split("/").filter(path => path);
  const { data, error, isLoading } = useQuestions();
  if (isLoading) return <div>読込み中...</div>;
  if (error) return <div>問題情報取得中にエラー発生</div>;
  if (!data) return <div>データがありません</div>;

  let courseFlug = false;
  let lessonflug = false;
  let questionFlug = false;
  const getCourseName = () => {
    courseFlug = false;
    return language(data.course.name);
  };
  const getLessonName = () => {
    lessonflug = false;
    return data?.lesson.name;
  };
  const getQuestionName = (id: number) => {
    questionFlug = false;
    const question = data?.questions?.find(question => question.id === id);
    return question?.title || "";
  };
  const pathList: { id: string; text: string; href: string }[] = [];
  let currentHref = "";

  //undefinedを返したくない→mapではなくforEach
  pathArray.forEach(path => {
    currentHref += `/${path}`;
    if (courseFlug) {
      pathList.push({
        id: path,
        text: getCourseName(),
        href: `/courses/${path}`,
      });
      courseFlug = false;
      return;
    }
    if (lessonflug) {
      pathList.push({
        id: path,
        text: getLessonName(),
        href: `/courses/${pathArray[1]}/lessons/${path}`,
      });
      lessonflug = false;
      return;
    }
    if (questionFlug) {
      pathList.push({
        id: path,
        text: getQuestionName(parseInt(path, 10)),
        href: currentHref,
      });
      questionFlug = false;
      return;
    }
    switch (path) {
      case "courses":
        courseFlug = true;
        pathList.push({ id: path, text: "コース一覧", href: "/courses" });
        break;
      case "lessons":
        lessonflug = true;
        break;
      case "questions":
        questionFlug = true;
        break;
      default:
        pathList.push({ id: path, text: path, href: currentHref });
    }
  });

  return (
    <nav>
      <ol>
        {pathList.map((path, index) => {
          return (
            <li key={index} className="inline">
              {index < pathList.length - 1 ? (
                <>
                  <Link href={path.href}>{path.text}</Link>
                  <span>{" > "}</span>
                </>
              ) : (
                <span>{path.text}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
