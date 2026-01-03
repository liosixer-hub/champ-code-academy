/**
 * 课程实体
 */
export interface Lesson {
  id: string
  date: string
  type: 'Historic' | 'Upcoming' | 'Available' | 'Today'
  subject: string
  students: string[]
  tutor: string | null
  status: string
}
