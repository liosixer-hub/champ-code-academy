import type { Lesson } from '../../entity/lesson';

export interface LessonState {
  lessons: Lesson[];
  fetchLessons: () => Promise<void>;
  takeLesson: (lessonId: string) => void;
}

export declare const useLessonStore: import('zustand').UseBoundStore<import('zustand').StoreApi<LessonState>>;
