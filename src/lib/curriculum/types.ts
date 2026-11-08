export type ChapterStepKind =
  | 'explanation'
  | 'demo'
  | 'interactive'
  | 'exercises'
  | 'quiz';

export type BoardSquare = string;

export type ChapterStepBase = {
  id: string;
  kind: ChapterStepKind;
  title: string;
};

export type ExplanationStep = ChapterStepBase & {
  kind: 'explanation';
  body: string;
};

export type DemoStep = ChapterStepBase & {
  kind: 'demo';
  body: string;
  fen: string;
  /**
   * Moves to animate. A move with `fen` starts a new legal position
   * instead of continuing the previous line. Every move must be legal
   * in chess.js from the position it starts on.
   */
  moves: Array<{
    from: BoardSquare;
    to: BoardSquare;
    promotion?: string;
    fen?: string;
  }>;
};

export type InteractiveStep = ChapterStepBase & {
  kind: 'interactive';
  body: string;
  fen: string;
  /** Allowed successful moves — any match completes the step */
  goals: Array<{ from: BoardSquare; to: BoardSquare }>;
  successMessage: string;
};

export type ExerciseItem = {
  id: string;
  prompt: string;
  fen: string;
  /** Squares that count as correct answers (tap targets) */
  correctSquares: BoardSquare[];
  hint?: string;
};

export type ExercisesStep = ChapterStepBase & {
  kind: 'exercises';
  body: string;
  items: ExerciseItem[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type QuizStep = ChapterStepBase & {
  kind: 'quiz';
  body: string;
  questions: QuizQuestion[];
  passScore: number;
  /** Legal position shown to the lamp on this quiz. */
  tutorFen?: string;
  tutorPrompts?: string[];
};

export type ChapterStep =
  | ExplanationStep
  | DemoStep
  | InteractiveStep
  | ExercisesStep
  | QuizStep;

export type Chapter = {
  id: string;
  number: number;
  title: string;
  summary: string;
  steps: [
    ExplanationStep,
    DemoStep,
    InteractiveStep,
    ExercisesStep,
    QuizStep,
  ];
};
