/**
 * Shared Components Declaration File
 */

import React from 'react';
import type { Lesson } from '../entity';

// Button component
export declare const Button: React.ComponentType<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'link';
} & React.ButtonHTMLAttributes<HTMLButtonElement>>;

// Header component (no props)
export declare const Header: React.ComponentType<{}>;

// LessonCard component
export declare const LessonCard: React.ComponentType<{
  lesson: Lesson;
  onTake?: (lessonId: string) => void;
}>;

// LessonSection component
export declare const LessonSection: React.ComponentType<{
  title: string;
  lessons: Lesson[];
  onTake?: (lessonId: string) => void;
}>;

// MessageTool component
export declare const MessageTool: React.ComponentType<{
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}>;

// ToolTip component
export declare const ToolTip: React.ComponentType<{
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}>;

// DatePicker component
export declare const DatePicker: React.ComponentType<{
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}>;