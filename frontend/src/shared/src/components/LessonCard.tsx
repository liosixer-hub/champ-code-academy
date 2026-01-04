// components/LessonCard.tsx
import React from 'react';
import type { Lesson } from '../entity';
import Button from './Button';

interface LessonCardProps {
  lesson: Lesson;
  onTake?: (lessonId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onTake }) => {
  const date = new Date(lesson.date);

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const isToday = lesson.type === 'Today';
  
  // Highlighted style for 'Today' lessons
  const containerClasses = isToday
    ? 'bg-secondary text-secondary-foreground border-input'
    : 'bg-card text-card-foreground border-border';

  const titleClasses = isToday
    ? 'text-foreground'
    : 'text-card-foreground';
    
  const mutedClasses = isToday
    ? 'text-secondary-foreground/80'
    : 'text-muted-foreground';

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayTime = isToday ? `Today: ${formattedTime}` : `${formattedDate} • ${formattedTime}`;

  return (
    <div
      className={`rounded-xl shadow-sm hover:shadow-md transition-all p-5 border ${containerClasses} relative overflow-hidden`}
    >
      {/* Top Section */}
      <div className="flex gap-4 mb-4">
        {/* Icon Placeholder */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isToday ? 'bg-secondary/50' : 'bg-muted'}`}>
             <span className="text-2xl">{isToday ? '🎮' : '📚'}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold truncate ${titleClasses}`}>
            {lesson.subject}
          </h3>
          <p className={`text-sm font-medium mt-1 ${mutedClasses}`}>
            {displayTime}
          </p>
        </div>
      </div>

      {/* Middle Section: Students */}
      <div className="mb-6">
        <p className={`text-xs font-semibold mb-2 ${mutedClasses}`}>
          Students
        </p>
        <div className="flex items-center gap-2">
          {lesson.students.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {lesson.students.map((student, index) => (
                <div
                  key={index}
                  className={`inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-xs font-bold ${isToday ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-foreground'}`}
                  title={student}
                >
                  {getInitials(student)}
                </div>
              ))}
            </div>
          ) : (
             <span className={`text-sm ${mutedClasses}`}>No students yet</span>
          )}
          
          {lesson.students.length > 0 && (
             <span className={`text-sm font-medium ml-2 ${isToday ? 'text-secondary-foreground' : 'text-foreground'}`}>
               {lesson.students.join(', ')}
             </span>
          )}
        </div>
      </div>

      {/* Action Button */}
          {onTake && (
        <div className="flex justify-end">
             <Button
                variant="primary"
                onClick={() => onTake(lesson.id)}
                className="w-auto px-6"
             >
                {isToday ? 'Join Class' : 'Take Class'}
             </Button>
        </div>
      )}
    </div>
  );
};
