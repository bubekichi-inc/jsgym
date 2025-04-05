import { QuestionLevel, QuestionType, FileExtension } from "@prisma/client";
import { buildPrisma } from "../src/app/_utils/prisma";

// コースデータ定義
const blogCourse = {
  title: "ブログサイトのフロントエンドを実装しよう",
  slug: "blog-course",
  description:
    "JavaScriptとReactを使ってブログサイトのフロントエンドを実装する方法を学びます。",
  thumbnailUrl: "https://placehold.jp/1200x630.png",
  lessons: [
    {
      title: "JavaScript事前知識レッスン",
      description: "ブログ実装に必要なJavaScriptの基本を学びます",
      questions: [
        {
          id: "blog-course-js-map",
          title: "配列のmap操作（記事の一覧表示用）",
          content:
            "記事の配列をmapメソッドを使って表示する方法を学びましょう。",
          reviewerId: 1,
          type: QuestionType.JAVA_SCRIPT,
          level: QuestionLevel.BASIC,
          inputCode:
            "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// TODO: articlesの各要素について、idとtitleをコンソールに出力してください\n// 出力例: 「1: JavaScriptの基本」「2: Reactとは？」「3: Next.jsの使い方」",
          outputCode: "",
          questionFiles: [
            {
              name: "index",
              ext: FileExtension.JS,
              template:
                "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// TODO: articlesの各要素について、idとtitleをコンソールに出力してください\n// 出力例: 「1: JavaScriptの基本」「2: Reactとは？」「3: Next.jsの使い方」",
              exampleAnswer:
                "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// articlesの各要素について、idとtitleをコンソールに出力する\narticles.map(article => {\n  console.log(`${article.id}: ${article.title}`);\n});",
            },
          ],
        },
        {
          id: "blog-course-js-find",
          title: "配列のfind操作（記事の詳細ページで一覧の中から探す用）",
          content:
            "記事のIDを使って配列から特定の記事を検索する方法を学びましょう。",
          reviewerId: 1,
          type: QuestionType.JAVA_SCRIPT,
          level: QuestionLevel.BASIC,
          inputCode:
            "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// TODO: id が 2 の記事を検索して、その記事の title と content を表示する関数 findArticle を実装してください\nfunction findArticle(id) {\n  // ここにコードを書いてください\n}\n\n// 以下のコードを実行すると「Reactとは？: UIライブラリの代表格...」と表示されるようにしてください\nconst article = findArticle(2);\nconsole.log(`${article.title}: ${article.content}`);\n",
          outputCode: "",
          questionFiles: [
            {
              name: "index",
              ext: FileExtension.JS,
              template:
                "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// TODO: id が 2 の記事を検索して、その記事の title と content を表示する関数 findArticle を実装してください\nfunction findArticle(id) {\n  // ここにコードを書いてください\n}\n\n// 以下のコードを実行すると「Reactとは？: UIライブラリの代表格...」と表示されるようにしてください\nconst article = findArticle(2);\nconsole.log(`${article.title}: ${article.content}`);\n",
              exampleAnswer:
                "// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', content: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Reactフレームワークの...' }\n];\n\n// id が 2 の記事を検索する関数\nfunction findArticle(id) {\n  return articles.find(article => article.id === id);\n}\n\n// 検索結果の表示\nconst article = findArticle(2);\nconsole.log(`${article.title}: ${article.content}`);\n",
            },
          ],
        },
        {
          id: "blog-course-js-tailwind",
          title: "TailwindCSS",
          content:
            "TailwindCSSの基本的な使い方と、ブログサイトでの活用方法を学びましょう。",
          reviewerId: 1,
          type: QuestionType.JAVA_SCRIPT,
          level: QuestionLevel.BASIC,
          inputCode:
            "// このHTMLをTailwindCSSを使ってスタイリングしてください\n// ブログ記事のカードを表示する要素です\n// TODO: div要素に適切なTailwindCSSのクラスを追加してください\n\n<div>\n  <h2>JavaScriptの基本</h2>\n  <p>プログラミング言語の一つ...</p>\n  <button>続きを読む</button>\n</div>\n",
          outputCode: "",
          questionFiles: [
            {
              name: "index",
              ext: FileExtension.JS,
              template:
                "// このHTMLをTailwindCSSを使ってスタイリングしてください\n// ブログ記事のカードを表示する要素です\n// TODO: div要素に適切なTailwindCSSのクラスを追加してください\n\n<div>\n  <h2>JavaScriptの基本</h2>\n  <p>プログラミング言語の一つ...</p>\n  <button>続きを読む</button>\n</div>\n",
              exampleAnswer:
                '// TailwindCSSを使用したブログ記事カード\n\n<div class="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-md mx-auto my-4">\n  <h2 class="text-xl font-bold text-gray-800 mb-2">JavaScriptの基本</h2>\n  <p class="text-gray-600 mb-4">プログラミング言語の一つ...</p>\n  <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300">続きを読む</button>\n</div>\n',
            },
          ],
        },
      ],
    },
    {
      title: "React実装レッスン",
      description: "Reactを使ってブログサイトを実装する方法を学びます",
      questions: [
        {
          id: "blog-course-react-ui",
          title: "記事の一覧ページの見た目",
          content:
            "Reactコンポーネントを使って記事の一覧ページを実装しましょう。",
          reviewerId: 1,
          type: QuestionType.REACT_JS,
          level: QuestionLevel.BASIC,
          inputCode:
            "import React from 'react';\n\n// TODO: ブログの一覧ページのヘッダーコンポーネントを実装してください\n// ヘッダーには「My Blog」というタイトルが含まれ、TailwindCSSでスタイリングしてください\n\nexport default function Header() {\n  // ここにコードを書いてください\n}\n",
          outputCode: "",
          questionFiles: [
            {
              name: "Header",
              ext: "JS",
              template:
                "import React from 'react';\n\n// TODO: ブログの一覧ページのヘッダーコンポーネントを実装してください\n// ヘッダーには「My Blog」というタイトルが含まれ、TailwindCSSでスタイリングしてください\n\nexport default function Header() {\n  // ここにコードを書いてください\n}\n",
              exampleAnswer:
                'import React from \'react\';\n\nexport default function Header() {\n  return (\n    <header className="bg-blue-600 text-white shadow-md py-4">\n      <div className="container mx-auto px-4 flex justify-between items-center">\n        <h1 className="text-2xl font-bold">My Blog</h1>\n        <nav>\n          <ul className="flex space-x-4">\n            <li><a href="#" className="hover:underline">Home</a></li>\n            <li><a href="#" className="hover:underline">About</a></li>\n            <li><a href="#" className="hover:underline">Contact</a></li>\n          </ul>\n        </nav>\n      </div>\n    </header>\n  );\n}\n',
            },
          ],
        },
        {
          id: "blog-course-react-list",
          title: "配列の表示",
          content:
            "Reactで記事の配列を表示するコンポーネントを実装しましょう。",
          reviewerId: 1,
          type: QuestionType.REACT_JS,
          level: QuestionLevel.BASIC,
          inputCode:
            "import React from 'react';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', excerpt: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', excerpt: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', excerpt: 'Reactフレームワークの...' }\n];\n\n// TODO: 記事一覧を表示するArticleListコンポーネントを実装してください\n// 各記事には、タイトル、抜粋、「続きを読む」ボタンを表示してください\n\nexport default function ArticleList() {\n  // ここにコードを書いてください\n}\n",
          outputCode: "",
          questionFiles: [
            {
              name: "ArticleList",
              ext: "JS",
              template:
                "import React from 'react';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', excerpt: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', excerpt: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', excerpt: 'Reactフレームワークの...' }\n];\n\n// TODO: 記事一覧を表示するArticleListコンポーネントを実装してください\n// 各記事には、タイトル、抜粋、「続きを読む」ボタンを表示してください\n\nexport default function ArticleList() {\n  // ここにコードを書いてください\n}\n",
              exampleAnswer:
                "import React from 'react';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', excerpt: 'プログラミング言語の一つ...' },\n  { id: 2, title: 'Reactとは？', excerpt: 'UIライブラリの代表格...' },\n  { id: 3, title: 'Next.jsの使い方', excerpt: 'Reactフレームワークの...' }\n];\n\n// 記事カードコンポーネント\nfunction ArticleCard({ article }) {\n  return (\n    <div className=\"bg-white p-6 rounded-lg shadow-md mb-6\">\n      <h2 className=\"text-xl font-bold mb-2\">{article.title}</h2>\n      <p className=\"text-gray-600 mb-4\">{article.excerpt}</p>\n      <button \n        className=\"bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors\"\n        onClick={() => console.log(`記事ID: ${article.id}が選択されました`)}\n      >\n        続きを読む\n      </button>\n    </div>\n  );\n}\n\n// 記事一覧コンポーネント\nexport default function ArticleList() {\n  return (\n    <div className=\"container mx-auto px-4 py-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">最新の記事</h1>\n      {articles.map(article => (\n        <ArticleCard key={article.id} article={article} />\n      ))}\n    </div>\n  );\n}\n",
            },
          ],
        },
        {
          id: "blog-course-react-detail",
          title: "詳細ページ",
          content:
            "記事の詳細ページを実装しましょう。URLパラメータから記事IDを取得し、対応する記事を表示します。",
          reviewerId: 1,
          type: QuestionType.REACT_JS,
          level: QuestionLevel.ADVANCED,
          inputCode:
            "import React from 'react';\nimport { useParams } from 'react-router-dom';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'JavaScriptは、Webページに対話性を追加するためによく使用されるプログラミング言語です。...' },\n  { id: 2, title: 'Reactとは？', content: 'Reactは、Facebookによって開発されたユーザーインターフェイスを構築するためのJavaScriptライブラリです。...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Next.jsは、Reactアプリケーションのためのフレームワークで、サーバーサイドレンダリングやその他の機能を提供します。...' }\n];\n\n// TODO: 記事詳細ページを実装してください\n// useParamsを使ってURLからidパラメータを取得し、対応する記事を表示してください\n// 記事が見つからない場合は「記事が見つかりません」と表示してください\n\nexport default function ArticleDetail() {\n  // ここにコードを書いてください\n}\n",
          outputCode: "",
          questionFiles: [
            {
              name: "ArticleDetail",
              ext: "JS",
              template:
                "import React from 'react';\nimport { useParams } from 'react-router-dom';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: 'JavaScriptの基本', content: 'JavaScriptは、Webページに対話性を追加するためによく使用されるプログラミング言語です。...' },\n  { id: 2, title: 'Reactとは？', content: 'Reactは、Facebookによって開発されたユーザーインターフェイスを構築するためのJavaScriptライブラリです。...' },\n  { id: 3, title: 'Next.jsの使い方', content: 'Next.jsは、Reactアプリケーションのためのフレームワークで、サーバーサイドレンダリングやその他の機能を提供します。...' }\n];\n\n// TODO: 記事詳細ページを実装してください\n// useParamsを使ってURLからidパラメータを取得し、対応する記事を表示してください\n// 記事が見つからない場合は「記事が見つかりません」と表示してください\n\nexport default function ArticleDetail() {\n  // ここにコードを書いてください\n}\n",
              exampleAnswer:
                'import React from \'react\';\nimport { useParams } from \'react-router-dom\';\n\n// 記事データ\nconst articles = [\n  { id: 1, title: \'JavaScriptの基本\', content: \'JavaScriptは、Webページに対話性を追加するためによく使用されるプログラミング言語です。...\' },\n  { id: 2, title: \'Reactとは？\', content: \'Reactは、Facebookによって開発されたユーザーインターフェイスを構築するためのJavaScriptライブラリです。...\' },\n  { id: 3, title: \'Next.jsの使い方\', content: \'Next.jsは、Reactアプリケーションのためのフレームワークで、サーバーサイドレンダリングやその他の機能を提供します。...\' }\n];\n\nexport default function ArticleDetail() {\n  // URLからidパラメータを取得\n  const { id } = useParams();\n  \n  // 数値に変換\n  const articleId = parseInt(id, 10);\n  \n  // 記事を検索\n  const article = articles.find(article => article.id === articleId);\n  \n  // 記事が見つからない場合\n  if (!article) {\n    return (\n      <div className="container mx-auto px-4 py-8">\n        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">\n          <p>記事が見つかりません</p>\n        </div>\n      </div>\n    );\n  }\n  \n  // 記事の表示\n  return (\n    <div className="container mx-auto px-4 py-8">\n      <article className="bg-white p-8 rounded-lg shadow-lg">\n        <h1 className="text-3xl font-bold mb-6">{article.title}</h1>\n        <div className="prose max-w-none">\n          <p className="text-gray-700">{article.content}</p>\n        </div>\n        <div className="mt-8">\n          <button \n            onClick={() => window.history.back()}\n            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"\n          >\n            ← 戻る\n          </button>\n        </div>\n      </article>\n    </div>\n  );\n}\n',
            },
          ],
        },
        {
          id: "blog-course-react-api",
          title: "API連携してサーバーの記事データを表示",
          content:
            "外部APIから記事データを取得して表示する方法を学びましょう。",
          reviewerId: 1,
          type: QuestionType.REACT_JS,
          level: QuestionLevel.ADVANCED,
          inputCode:
            "import React, { useState, useEffect } from 'react';\n\n// TODO: APIから記事データを取得して表示するコンポーネントを実装してください\n// 取得中は「読み込み中...」と表示し、エラーが発生した場合は「エラーが発生しました」と表示してください\n// データ取得には fetch API を使用してください\n// データ取得先URL: https://jsonplaceholder.typicode.com/posts\n\nexport default function ArticlesFromAPI() {\n  // ここにコードを書いてください\n}\n",
          outputCode: "",
          questionFiles: [
            {
              name: "ArticlesFromAPI",
              ext: "JS",
              template:
                "import React, { useState, useEffect } from 'react';\n\n// TODO: APIから記事データを取得して表示するコンポーネントを実装してください\n// 取得中は「読み込み中...」と表示し、エラーが発生した場合は「エラーが発生しました」と表示してください\n// データ取得には fetch API を使用してください\n// データ取得先URL: https://jsonplaceholder.typicode.com/posts\n\nexport default function ArticlesFromAPI() {\n  // ここにコードを書いてください\n}\n",
              exampleAnswer:
                'import React, { useState, useEffect } from \'react\';\n\nexport default function ArticlesFromAPI() {\n  const [articles, setArticles] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  \n  useEffect(() => {\n    const fetchArticles = async () => {\n      try {\n        // データ取得開始\n        setLoading(true);\n        \n        // APIからデータ取得\n        const response = await fetch(\'https://jsonplaceholder.typicode.com/posts\');\n        \n        // レスポンスをチェック\n        if (!response.ok) {\n          throw new Error(`APIエラー: ${response.status}`);\n        }\n        \n        // JSONデータを取得\n        const data = await response.json();\n        \n        // 最初の10件だけ表示\n        setArticles(data.slice(0, 10));\n        setError(null);\n      } catch (err) {\n        // エラーハンドリング\n        setError(err.message);\n        setArticles([]);\n      } finally {\n        // 読み込み完了\n        setLoading(false);\n      }\n    };\n    \n    fetchArticles();\n  }, []);\n  \n  // 読み込み中の表示\n  if (loading) {\n    return (\n      <div className="container mx-auto px-4 py-8">\n        <div className="flex justify-center items-center h-64">\n          <p className="text-xl text-gray-600">読み込み中...</p>\n        </div>\n      </div>\n    );\n  }\n  \n  // エラー時の表示\n  if (error) {\n    return (\n      <div className="container mx-auto px-4 py-8">\n        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">\n          <p>エラーが発生しました: {error}</p>\n        </div>\n      </div>\n    );\n  }\n  \n  // 記事一覧の表示\n  return (\n    <div className="container mx-auto px-4 py-8">\n      <h1 className="text-3xl font-bold mb-8">APIから取得した記事</h1>\n      {articles.map(article => (\n        <div key={article.id} className="bg-white p-6 rounded-lg shadow-md mb-6">\n          <h2 className="text-xl font-bold mb-2">{article.title}</h2>\n          <p className="text-gray-600 mb-4">{article.body}</p>\n          <button \n            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"\n            onClick={() => console.log(`記事ID: ${article.id}が選択されました`)}\n          >\n            詳細を表示\n          </button>\n        </div>\n      ))}\n    </div>\n  );\n}\n',
            },
          ],
        },
      ],
    },
  ],
};

// シードデータを作成する関数
const seedCourseData = async () => {
  const prisma = await buildPrisma();

  try {
    console.log("コースデータの作成を開始します...");

    // コースを作成
    const course = await prisma.course.create({
      data: {
        title: blogCourse.title,
        slug: blogCourse.slug,
        description: blogCourse.description,
        thumbnailUrl: blogCourse.thumbnailUrl,
      },
    });

    console.log(`コース「${course.title}」を作成しました。ID: ${course.id}`);

    // レッスンとその質問を作成
    for (const lessonData of blogCourse.lessons) {
      const lesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          description: lessonData.description,
          courseId: course.id,
        },
      });

      console.log(
        `レッスン「${lesson.title}」を作成しました。ID: ${lesson.id}`
      );

      // 各レッスンの質問を作成
      for (const questionData of lessonData.questions) {
        // 質問を作成
        const question = await prisma.question.create({
          data: {
            id: questionData.id,
            title: questionData.title,
            content: questionData.content,
            reviewerId: questionData.reviewerId,
            type: questionData.type,
            level: questionData.level,
            inputCode: questionData.inputCode,
            outputCode: questionData.outputCode,
            lessonId: lesson.id,
          },
        });

        console.log(
          `質問「${question.title}」を作成しました。ID: ${question.id}`
        );

        // 質問ファイルを作成
        for (const fileData of questionData.questionFiles) {
          await prisma.questionFile.create({
            data: {
              name: fileData.name,
              ext: fileData.ext as FileExtension,
              template: fileData.template,
              exampleAnswer: fileData.exampleAnswer,
              isRoot: true,
              questionId: question.id,
            },
          });
        }
      }
    }

    console.log("コースデータの作成が完了しました！");
  } catch (error) {
    console.error("コースデータの作成中にエラーが発生しました:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// シード実行
seedCourseData();
