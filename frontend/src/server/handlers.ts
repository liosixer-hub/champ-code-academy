import { http, HttpResponse, delay } from 'msw';
import { mockLessons } from './data';

// 模拟网络延迟
const ARTIFICIAL_DELAY_MS = 800;

export const handlers = [
  // Auth Handlers
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(ARTIFICIAL_DELAY_MS);
    
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (email === "user@example.com" && password === "password") {
      return HttpResponse.json({
        id: 1,
        name: "John Doe",
        email: email
      });
    }

    return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' });
  }),

  // Lessons Handlers
  http.get('*/api/lessons', async () => {
    await delay(ARTIFICIAL_DELAY_MS);
    return HttpResponse.json(mockLessons);
  }),

  http.get('*/api/lessons/:id', async ({ params }) => {
    await delay(ARTIFICIAL_DELAY_MS);
    const { id } = params;
    const lesson = mockLessons.find(l => l.id === id);
    
    if (lesson) {
      return HttpResponse.json(lesson);
    }
    
    return new HttpResponse(null, { status: 404, statusText: 'Lesson not found' });
  }),

  http.post('*/api/lessons/:id/take', async ({ params }) => {
    await delay(ARTIFICIAL_DELAY_MS);
    const { id } = params;
    const lessonIndex = mockLessons.findIndex(l => l.id === id);
    
    if (lessonIndex > -1) {
      const lesson = mockLessons[lessonIndex];
      if (lesson.type === "Available") {
        // Update mock data in memory (won't persist across reloads unless we use localStorage)
        // For simple mock, this is fine.
        const updatedLesson = {
            ...lesson,
            type: "Upcoming",
            tutor: "Sarah Tan",
            status: "Confirmed"
        };
        mockLessons[lessonIndex] = updatedLesson;
        
        return HttpResponse.json({
          success: true,
          message: "Lesson taken successfully",
          lesson: updatedLesson
        });
      }
      return new HttpResponse(null, { status: 400, statusText: 'Lesson is not available' });
    }
    
    return new HttpResponse(null, { status: 404, statusText: 'Lesson not found' });
  })
];
