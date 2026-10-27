import { useEffect, useState } from 'react';
import { courses, type Course } from './data';

export interface StudentProfile { name: string; email: string; }
export interface Enrollment { courseId: string; enrolledAt: string; completedLessons: number[]; updatedAt: string; }
export interface LearningState { version: 1; profile: StudentProfile | null; enrollments: Enrollment[]; }
export interface Lesson { index: number; title: string; module: string; }
export const LEARNING_KEY = 'knowlect-learning-v1';
export const LEARNING_EVENT = 'knowlect-learning-changed';
const emptyState = (): LearningState => ({ version: 1, profile: null, enrollments: [] });

export function lessonsFor(course: Course): Lesson[] {
  return Array.from({ length: course.lessons }, (_, index) => {
    const moduleIndex = Math.min(course.topics.length - 1, Math.floor(index * course.topics.length / course.lessons));
    const module = course.topics[moduleIndex] ?? course.title;
    return { index, title: `Lesson ${index + 1} · ${module}`, module };
  });
}

export function parseLearningState(raw: string | null): LearningState {
  if (!raw) return emptyState();
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object') throw new Error('Stored learning data is not valid.');
  const value = data as Record<string, unknown>;
  if (value.version !== 1 || !Array.isArray(value.enrollments)) throw new Error('Stored learning data is not supported.');
  const profileValue = value.profile as Partial<StudentProfile> | null;
  const profile = profileValue && typeof profileValue.name === 'string' && typeof profileValue.email === 'string'
    ? { name: profileValue.name.slice(0, 80), email: profileValue.email.slice(0, 254) } : null;
  const seen = new Set<string>();
  const enrollments: Enrollment[] = [];
  for (const item of value.enrollments) {
    if (!item || typeof item !== 'object') continue;
    const entry = item as Partial<Enrollment>;
    const course = courses.find(candidate => candidate.id === entry.courseId);
    if (!course || seen.has(course.id)) continue;
    seen.add(course.id);
    const completedLessons = Array.isArray(entry.completedLessons)
      ? [...new Set(entry.completedLessons.filter(index => Number.isInteger(index) && index >= 0 && index < course.lessons))].sort((a, b) => a - b) : [];
    enrollments.push({ courseId: course.id, enrolledAt: typeof entry.enrolledAt === 'string' ? entry.enrolledAt : '', updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : '', completedLessons });
  }
  return { version: 1, profile, enrollments };
}

export function readLearningState(): LearningState {
  if (typeof window === 'undefined') return emptyState();
  try { return parseLearningState(window.localStorage.getItem(LEARNING_KEY)); }
  catch { throw new Error('Your browser could not read saved learning data. Enable local storage or clear the Knowlect learning data and try again.'); }
}

function writeLearningState(state: LearningState) {
  try { window.localStorage.setItem(LEARNING_KEY, JSON.stringify(state)); }
  catch { throw new Error('Browser storage is unavailable or full. Nothing was saved. Please enable storage and try again.'); }
  window.dispatchEvent(new Event(LEARNING_EVENT));
  return state;
}

export function enrollCourse(courseId: string, profile: StudentProfile): LearningState {
  if (!courses.some(course => course.id === courseId)) throw new Error('This course is not available.');
  const name = profile.name.trim(); const email = profile.email.trim();
  if (name.length < 2 || name.length > 80) throw new Error('Please enter a name between 2 and 80 characters.');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  const state = readLearningState();
  const now = new Date().toISOString();
  const enrollments = state.enrollments.some(entry => entry.courseId === courseId) ? state.enrollments : [...state.enrollments, { courseId, enrolledAt: now, updatedAt: now, completedLessons: [] }];
  return writeLearningState({ version: 1, profile: { name, email }, enrollments });
}

export function toggleLesson(courseId: string, index: number): LearningState {
  const state = readLearningState();
  const course = courses.find(candidate => candidate.id === courseId);
  if (!course || !Number.isInteger(index) || index < 0 || index >= course.lessons) throw new Error('This lesson is not available.');
  if (!state.enrollments.some(entry => entry.courseId === courseId)) throw new Error('Register for this course before tracking lessons.');
  return writeLearningState({ ...state, enrollments: state.enrollments.map(entry => entry.courseId !== courseId ? entry : { ...entry, updatedAt: new Date().toISOString(), completedLessons: entry.completedLessons.includes(index) ? entry.completedLessons.filter(item => item !== index) : [...entry.completedLessons, index].sort((a, b) => a - b) }) });
}

export function useLearningState() {
  const [state, setState] = useState<LearningState>(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const refresh = () => {
      try { setState(readLearningState()); setError(''); }
      catch (err) { setError(err instanceof Error ? err.message : 'Unable to read learning data.'); }
      setReady(true);
    };
    const onStorage = (event: StorageEvent) => { if (!event.key || event.key === LEARNING_KEY) refresh(); };
    refresh();
    window.addEventListener(LEARNING_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener(LEARNING_EVENT, refresh); window.removeEventListener('storage', onStorage); };
  }, []);
  return { state, ready, error };
}
