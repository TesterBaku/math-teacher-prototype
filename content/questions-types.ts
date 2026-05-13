export type QuestionType = 'multiple_choice' | 'sign_select' | 'numeric_input';

export type Question = {
  questionId: string;
  lessonId: string;
  type: QuestionType;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  correctExplanation: string;
  wrongFeedback?: Record<string, string>;
  helperText?: string;
};
