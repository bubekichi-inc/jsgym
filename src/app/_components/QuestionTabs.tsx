import {
  QuestionType,
  QuestionLevel,
  UserQuestionStatus,
} from '@prisma/client';
import { useMe } from '../(member)/_hooks/useMe';
import { useDevice } from '../_hooks/useDevice';

type ExtendedStatus = UserQuestionStatus | 'NOT_SUBMITTED' | 'ALL';

interface Props {
  selectedType: 'ALL' | QuestionType;
  handleTypeChange: (type: QuestionType | 'ALL') => void;
  selectedLevel: 'ALL' | QuestionLevel;
  handleLevelChange: (level: QuestionLevel | 'ALL') => void;
  selectedStatus: ExtendedStatus;
  handleStatusChange: (status: ExtendedStatus) => void;
}

export const QuestionTabs: React.FC<Props> = ({
  selectedType,
  handleTypeChange,
  selectedLevel,
  handleLevelChange,
  selectedStatus,
  handleStatusChange,
}: Props) => {
  const { isSp } = useDevice();
  const { data: me } = useMe();
  return (
    <div className='mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:flex-wrap md:justify-center'>
      <div className='space-y-3'>
        {/* タイプ選択タブ */}
        <div className='flex items-center gap-4 rounded-md bg-white px-4'>
          {!isSp && <p className='text-xs font-bold text-gray-500'>タイプ</p>}
          <div className='flex h-10 items-center justify-center rounded-md p-1 text-gray-500'>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedType === 'ALL'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleTypeChange('ALL')}
            >
              すべて
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedType === 'JAVA_SCRIPT'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleTypeChange('JAVA_SCRIPT')}
            >
              JavaScript
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedType === 'REACT_JS'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleTypeChange('REACT_JS')}
            >
              React
            </button>
          </div>
        </div>

        {/* レベル選択タブ */}
        <div className='flex items-center gap-4 rounded-md bg-white px-4'>
          {!isSp && <p className='text-xs font-bold text-gray-500'>レベル</p>}
          <div className='flex h-10 items-center justify-center rounded-md p-1 text-gray-500'>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedLevel === 'ALL'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleLevelChange('ALL')}
            >
              すべて
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedLevel === 'BASIC'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleLevelChange('BASIC')}
            >
              基礎
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedLevel === 'ADVANCED'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleLevelChange('ADVANCED')}
            >
              応用
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                selectedLevel === 'REAL_WORLD'
                  ? 'bg-blue-100 text-blue-800 shadow-sm'
                  : ''
              }`}
              onClick={() => handleLevelChange('REAL_WORLD')}
            >
              実務模擬
            </button>
          </div>
        </div>

        {/* ステータス選択タブ */}
        {me && (
          <div className='flex items-center gap-4 rounded-md bg-white px-4'>
            {!isSp && (
              <p className='text-xs font-bold text-gray-500'>ステータス</p>
            )}
            <div className='flex h-10 items-center justify-center rounded-md p-1 text-gray-500'>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedStatus === 'ALL'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : ''
                }`}
                onClick={() => handleStatusChange('ALL')}
              >
                すべて
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedStatus === 'NOT_SUBMITTED'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : ''
                }`}
                onClick={() => handleStatusChange('NOT_SUBMITTED')}
              >
                未提出
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedStatus === 'PASSED'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : ''
                }`}
                onClick={() => handleStatusChange('PASSED')}
              >
                合格済み
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedStatus === 'REVISION_REQUIRED'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : ''
                }`}
                onClick={() => handleStatusChange('REVISION_REQUIRED')}
              >
                再提出
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  selectedStatus === 'DRAFT'
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : ''
                }`}
                onClick={() => handleStatusChange('DRAFT')}
              >
                下書き
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
