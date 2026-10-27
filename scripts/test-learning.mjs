import assert from 'node:assert/strict';
import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const learning = await vite.ssrLoadModule('/src/learning.ts');
  const { courses } = await vite.ssrLoadModule('/src/data.ts');
  const storage = new Map();
  let events = 0;
  globalThis.window = {
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    dispatchEvent: () => { events += 1; return true; },
  };
  assert.deepEqual(learning.readLearningState().enrollments, []);
  assert.throws(() => learning.enrollCourse('python', { name: ' ', email: 'bad' }));
  assert.throws(() => learning.enrollCourse('missing', { name: 'Demo Student', email: 'student@example.com' }));
  assert.throws(() => learning.enrollCourse('python', { name: 'Demo Student', email: 'bad' }));
  assert.throws(() => learning.toggleLesson('python', 0));
  let state = learning.enrollCourse('python', { name: ' Demo Student ', email: ' student@example.com ' });
  assert.equal(state.profile.name, 'Demo Student');
  assert.equal(state.enrollments.length, 1);
  assert.equal(state.enrollments[0].completedLessons.length, 0);
  state = learning.toggleLesson('python', 0);
  assert.deepEqual(state.enrollments[0].completedLessons, [0]);
  assert.deepEqual(learning.readLearningState().enrollments[0].completedLessons, [0]);
  state = learning.enrollCourse('python', { name: 'Demo Student', email: 'student@example.com' });
  assert.equal(state.enrollments.length, 1);
  assert.deepEqual(state.enrollments[0].completedLessons, [0]);
  state = learning.enrollCourse('marketing', { name: 'Demo Student', email: 'student@example.com' });
  assert.equal(state.enrollments.length, 2);
  learning.toggleLesson('marketing', 0);
  state = learning.toggleLesson('python', 0);
  assert.deepEqual(state.enrollments[0].completedLessons, []);
  assert.deepEqual(state.enrollments[1].completedLessons, [0]);
  assert.throws(() => learning.toggleLesson('python', 25));
  assert.throws(() => learning.toggleLesson('python', -1));
  assert.throws(() => learning.toggleLesson('python', 1.2));
  for (let i = 0; i < 25; i++) state = learning.toggleLesson('python', i);
  assert.equal(state.enrollments[0].completedLessons.length, 25);
  assert.equal(Math.round(state.enrollments[0].completedLessons.length / 25 * 100), 100);
  for (const course of courses) {
    const lessons = learning.lessonsFor(course);
    assert.equal(lessons.length, course.lessons);
    assert.equal(new Set(lessons.map(lesson => lesson.index)).size, course.lessons);
  }
  const sanitized = learning.parseLearningState(JSON.stringify({ version: 1, profile: null, enrollments: [{ courseId: 'python', completedLessons: [0, 0, 24, 25, -1, '2', 2.5] }, { courseId: 'python' }, { courseId: 'unknown' }] }));
  assert.equal(sanitized.enrollments.length, 1);
  assert.deepEqual(sanitized.enrollments[0].completedLessons, [0, 24]);
  storage.set(learning.LEARNING_KEY, '{broken');
  assert.throws(() => learning.readLearningState());
  assert.throws(() => learning.enrollCourse('python', { name: 'Demo Student', email: 'student@example.com' }));
  assert.equal(storage.get(learning.LEARNING_KEY), '{broken');
  storage.delete(learning.LEARNING_KEY);
  window.localStorage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => learning.enrollCourse('python', { name: 'Demo Student', email: 'student@example.com' }), /Nothing was saved/);
  assert.equal(storage.has(learning.LEARNING_KEY), false);
  assert.ok(events > 0);
  delete globalThis.window;
  assert.deepEqual(learning.readLearningState().enrollments, []);
  console.log('Learning tests passed: validation, local enrollment, duplicate preservation, isolated courses, undo, 100% completion, refresh persistence, lesson counts, sanitization, corrupt data, unavailable storage, and SSR safety.');
} finally {
  await vite.close();
}
