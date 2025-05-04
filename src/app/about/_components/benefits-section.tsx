export function BenefitsSection() {
  return (
    <section className="bg-gray-100/50 py-12 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              JavaScript学習のお悩みを解決
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              JS Gymは、JavaScriptを学ぶ際によくある課題を解決します。
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <svg
                className="mb-2 size-12 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold">
                基礎は学んだけど、なかなか自走して書けるようにならない
              </h3>
            </div>
            <div>
              <p className="text-base text-gray-500">
                <span className="font-bold text-black">⇨</span>{" "}
                競技プログラミング方式で、ひたすら問題を解いて自走力を鍛えられる
              </p>
            </div>
          </div>
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <svg
                className="mb-2 size-12 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 18L22 12L16 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6L2 12L8 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 4L14 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold">
                AIを頼りすぎて、理解が曖昧でコードに責任を持てない
              </h3>
            </div>
            <div>
              <p className="text-base text-gray-500">
                <span className="font-bold text-black">⇨</span>{" "}
                AIを頼れない環境で、自分の頭で組み立て、判断する力を養える
              </p>
            </div>
          </div>
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm">
            <div className="pb-2">
              <svg
                className="mb-2 size-12 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 11L12 14L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold">
                動きはするけど、実務の現場で通用する書き方ができているのか不安
              </h3>
            </div>
            <div>
              <p className="text-base text-gray-500">
                <span className="font-bold text-black">⇨</span>{" "}
                現場視点のコードレビューを受け、自信を身につけられる
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
