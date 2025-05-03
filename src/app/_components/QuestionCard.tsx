'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import {
  questionTagTextMap,
  questionTypeTextMap,
  userQuestionStatusColorMap,
  userQuestionStatusTextMap,
} from '@/app/_constants';
import { Question } from '@/app/api/questions/route';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const status = question.userQuestions?.[0]?.status || null;
  return (
    <div className='flex flex-col gap-y-4 rounded-2xl bg-white p-6 shadow-blue'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-y-2'>
          <div className='flex items-center gap-x-2'>
            <span className='text-xs/[1.5] text-textMain'>
              {dayjs(question.createdAt).format('YYYY/MM/DD_HH:mm')}
            </span>
            {dayjs(question.createdAt).isSame(dayjs(), 'day') && (
              <span className='text-sm/[1] font-bold text-yellow-400'>
                NEW!!
              </span>
            )}
          </div>
          <div className='flex items-center gap-x-[19px]'>
            <span className='relative bg-buttonMain py-1.5 pl-5 pr-1 text-base/[1] font-bold text-white before:absolute before:left-2 before:top-1/2 before:size-1 before:-translate-y-1/2 before:rounded-l-full before:bg-white after:absolute after:right-[-9px] after:top-0 after:block after:h-full after:w-[9px] after:bg-buttonMain after:[clip-path:polygon(9px_50%,_0%_0%,_0%_100%)]'>
              {
                questionTypeTextMap[
                  question.type as keyof typeof questionTypeTextMap
                ]
              }
            </span>
            {question.reviewer && (
              <div className='group relative'>
                <div
                  className={`flex size-10 items-center justify-center overflow-hidden rounded-full`}
                >
                  <Image
                    src={question.reviewer.profileImageUrl}
                    alt='reviewer'
                    width={80}
                    height={80}
                    className='size-full object-cover'
                  />
                </div>
                <div className='invisible absolute -right-4 bottom-full z-10 mb-2 w-[320px] rounded-lg bg-gray-900 p-2 text-sm text-white opacity-0 transition-all group-hover:visible group-hover:opacity-100'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-300'>レビュワー</span>
                    <p className='font-bold'>{question.reviewer.name}</p>
                  </div>
                  <p className='mt-1 whitespace-pre-line text-xs text-gray-300'>
                    {question.reviewer.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {status && (
          <span
            className={`inline-flex h-12 w-20 items-center justify-center rounded-md text-base/[1] font-bold ${userQuestionStatusColorMap[status]}`}
          >
            {userQuestionStatusTextMap[status]}
          </span>
        )}
      </div>
      <div className='grid gap-2'>
        <p className='text-lg/[1.5] font-bold md:text-xl/[1.5]'>
          {question.title}
        </p>
        <p className='line-clamp-2 text-sm/[1.5] md:text-base'>
          {question.content}
        </p>
      </div>
      <ul className='flex flex-wrap gap-2'>
        {question.questions.map((q) => (
          <li
            key={q.tag.name}
            className='rounded-md border border-gray-500 px-1.5 py-[3px] text-xs/[1] text-gray-500'
          >
            {questionTagTextMap[q.tag.name as keyof typeof questionTagTextMap]}
          </li>
        ))}
      </ul>
      <Link
        href={`/q/${question.id}`}
        className='mt-auto flex h-10 w-full items-center justify-center rounded-md bg-buttonMain text-base/[1] font-bold text-white duration-200 hover:scale-105'
      >
        この問題に挑戦する
      </Link>
    </div>
  );
};
