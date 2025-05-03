'use client';

import { QuestionType, UserQuestionStatus } from '@prisma/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { QuestionCard } from '@/app/_components/QuestionCard';
import { QuestionTabs } from '@/app/_components/QuestionTabs';
import { Skeleton } from '@/app/_components/Skeleton';
import { useQuestions } from '@/app/_hooks/useQuestions';
import { QuestionLevel } from '@/app/_serevices/JsQuestionGenerateService';

// 拡張ステータス型
type ExtendedStatus = UserQuestionStatus | 'NOT_SUBMITTED' | 'ALL';
interface Props {
  limit: number;
}

export const Questions: React.FC<Props> = ({ limit }) => {
  const searchParams = useSearchParams();

  // URLクエリパラメータから初期状態を取得
  const initialTitle = searchParams.get('title') || '';
  const initialLevel =
    (searchParams.get('level') as QuestionLevel | 'ALL') || 'ALL';
  const initialType =
    (searchParams.get('type') as QuestionType | 'ALL') || 'ALL';
  const initialStatus = (searchParams.get('status') as ExtendedStatus) || 'ALL';

  const {
    questions,
    selectedLevel,
    selectedStatus,
    isLoading,
    handleLevelChange,
    handleStatusChange,
    selectedType,
    handleTypeChange,
  } = useQuestions({
    limit,
    initialTitle,
    initialType,
    initialLevel,
    initialStatus,
  });

  return (
    <section className='py-8 md:pb-[52px] md:pt-20'>
      <div className='mx-auto flex flex-col items-center justify-center space-y-4 px-6 text-center'>
        <div className='grid gap-y-3 text-left md:gap-y-4 md:text-center'>
          <h2 className='text-2xl/[1.5] font-bold md:text-[2.5rem]'>
            JS Gymでは、毎日新しい問題が追加されます
          </h2>
          <p className='text-base/[1.5] text-gray-500 md:text-xl/[1.5]'>
            より実務に特化した、幅広いレベルの問題を出題。
          </p>
        </div>
      </div>

      <QuestionTabs
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        selectedLevel={selectedLevel}
        handleLevelChange={handleLevelChange}
        selectedStatus={selectedStatus}
        handleStatusChange={handleStatusChange}
      />

      {/* 問題一覧 */}
      {isLoading ? (
        <div className='px-6'>
          <div className='mx-auto mt-8 grid max-w-[1152px] grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index}>
                <div className='flex flex-col gap-y-4 rounded-2xl bg-white p-6 shadow-blue'>
                  <div className='flex justify-between'>
                    <div className='flex flex-col gap-y-2'>
                      <Skeleton width={150} height={16} />
                      <div className='flex items-center gap-x-2.5'>
                        <Skeleton width={117} height={28} />
                        <Skeleton width={40} height={40} round={20} />
                      </div>
                    </div>
                    <Skeleton width={80} height={48} />
                  </div>
                  <Skeleton height={100} />
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton width={72} height={18} />
                    <Skeleton width={72} height={18} />
                    <Skeleton width={72} height={18} />
                  </div>
                  <Skeleton height={40} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='px-6'>
          <div className='mt-8 md:mt-10'>
            <div className='mx-auto grid max-w-[1152px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3'>
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>

            {questions.length === 0 && !isLoading && (
              <div className='mt-8 text-center text-gray-500'>
                問題が見つかりませんでした。検索条件を変更してみてください。
              </div>
            )}
          </div>

          <div className='flex justify-center'>
            <Link
              href='/q'
              className='mt-8 rounded-[5px] border border-gray-500 bg-white px-6 py-2.5 text-[1.375rem]/[1] font-bold text-gray-500 transition-colors hover:bg-gray-500 hover:text-white md:mt-16'
            >
              もっと見る
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
