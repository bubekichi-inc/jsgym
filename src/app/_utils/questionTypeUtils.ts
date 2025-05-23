/**
 * Question type utilities for consistent type handling across the application
 */

export type QuestionType = 'JAVA_SCRIPT' | 'TYPE_SCRIPT' | 'REACT_JS' | 'REACT_TS';

/**
 * Get display label for question type
 */
export const getQuestionTypeLabel = (type: QuestionType): string => {
  const typeLabels: Record<QuestionType, string> = {
    JAVA_SCRIPT: 'JavaScript',
    TYPE_SCRIPT: 'TypeScript',
    REACT_JS: 'React (JS)',
    REACT_TS: 'React (TS)',
  };

  return typeLabels[type] || type;
};

/**
 * Get editor language for question type
 */
export const getEditorLanguage = (type: QuestionType): string => {
  switch (type) {
    case 'TYPE_SCRIPT':
    case 'REACT_TS':
      return 'typescript';
    case 'JAVA_SCRIPT':
    case 'REACT_JS':
    default:
      return 'javascript';
  }
};

/**
 * Check if question type is React-based
 */
export const isReactType = (type: QuestionType): boolean => {
  return type === 'REACT_JS' || type === 'REACT_TS';
};

/**
 * Check if question type is TypeScript-based
 */
export const isTypeScriptType = (type: QuestionType): boolean => {
  return type === 'TYPE_SCRIPT' || type === 'REACT_TS';
};

/**
 * Get file extension for question type
 */
export const getFileExtension = (type: QuestionType): string => {
  switch (type) {
    case 'JAVA_SCRIPT':
      return 'js';
    case 'TYPE_SCRIPT':
      return 'ts';
    case 'REACT_JS':
      return 'jsx';
    case 'REACT_TS':
      return 'tsx';
    default:
      return 'js';
  }
};
