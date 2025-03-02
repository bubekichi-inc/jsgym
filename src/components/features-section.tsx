export function FeaturesSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              主な機能
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              JS
              Gymは、JavaScriptの実践的なスキルを効率的に身につけるための機能を提供します。
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="pb-2">
              <svg
                className="mb-2 size-12 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold">
                すぐに始められる学習環境
              </h3>
            </div>
            <div>
              <p className="text-base text-gray-500 dark:text-gray-400">
                コードエディタ等での開発環境の構築は不要です。JS
                Gym上でコードを書いて、動作を確認できるサンドボックス環境を用意しています。
              </p>
            </div>
          </div>
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
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
                実務頻出の構文に特化した問題構成
              </h3>
            </div>
            <div>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Webアプリ開発の場で頻出の文法を中心に問題を構成しています。JSの文法は膨大にある中で、実務ではほぼ使わない構文がほとんどです。JS
                Gymでは、実務に特化したJS開発の訓練を積めます。
              </p>
            </div>
          </div>
          <div className="h-full rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="pb-2">
              <svg
                className="mb-2 size-12 text-yellow-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-semibold">AIコードレビュー</h3>
            </div>
            <div>
              <p className="text-base text-gray-500 dark:text-gray-400">
                書いたコードは、AIがコードレビューします。実務で抑えてほしいチェック項目を全て網羅したレビューをします。ただ動けばOKでなく、実務で通用する書き方ができるまで、繰り返しレビューを受けることができます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
