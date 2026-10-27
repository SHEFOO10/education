import type { ReactNode } from 'react';
import { courses, faqs, mentors } from './data';
import { articles } from './journal';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage, CourseDetailPage } from './pages/CoursePages';
import { AboutPage, InstructorDetailPage, InstructorsPage, mentorSlug, TestimonialsPage } from './pages/CommunityPages';
import { ArticlePage, BlogPage, ContactPage, FaqPage, LegalPage, NotFoundPage } from './pages/InfoPages';

export interface RouteMetadata { path: string; title: string; description: string; robots?: string; }
export interface ResolvedRoute extends RouteMetadata { content: ReactNode; notFound: boolean; }
export interface RouteDeclaration { path: string; title: string; }

const fixedRoutes: RouteMetadata[] = [
  { path: '/', title: 'Knowlect — Unlock Skills That Shape Your Future', description: 'Explore practical, expert-led courses in design, development, marketing, and more. Learn at your own pace with Knowlect.' },
  { path: '/courses', title: 'Explore Courses | Knowlect', description: 'Find practical, self-paced courses in design, development, marketing, and graphic design.' },
  { path: '/about', title: 'About Knowlect | Skills That Move You Forward', description: 'Meet Knowlect: thoughtful courses, useful practice, and mentors who help make the next step feel possible.' },
  { path: '/testimonials', title: 'Learner Stories | Knowlect', description: 'Read learner reflections about the courses, projects, and practice that helped them build new skills.' },
  { path: '/instructors', title: 'Meet the Instructors | Knowlect', description: 'Find a course mentor by name or discipline and explore each instructor’s teaching approach.' },
  { path: '/contact', title: 'Contact Knowlect', description: 'Get in touch with Knowlect about courses, learning, and finding your next step.' },
  { path: '/blog', title: 'Learning Journal | Knowlect', description: 'Practical ideas for learning a skill, working with feedback, and showing your work.' },
  { path: '/faq', title: 'Frequently Asked Questions | Knowlect', description: 'Answers about Knowlect courses, learning at your own pace, certificates, and course access.' },
  { path: '/privacy', title: 'Privacy Notice | Knowlect Demo', description: 'How your learner profile, local registrations, lesson checkmarks, and other browser-only demonstration data are stored.' },
  { path: '/terms', title: 'Terms of Use | Knowlect Demo', description: 'How the browser-local registration and lesson progress demo works, and which payment, account, and course features are not connected.' },
  { path: '/404', title: 'Page Not Found | Knowlect', description: 'The requested Knowlect page could not be found.', robots: 'noindex,nofollow' },
  { path: '/dashboard', title: 'Student Dashboard | Knowlect', description: 'Your browser-local learning space: track registered courses and self-reported lesson progress.', robots: 'noindex,nofollow' },
];

function safeDecode(value: string) {
  try { return decodeURIComponent(value); } catch { return value; }
}

export function normalizePath(path: string) {
  const pathOnly = path.split('?')[0].split('#')[0];
  const collapsed = pathOnly.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return collapsed || '/';
}

export function allPrerenderedRoutes(): RouteMetadata[] {
  return [
    ...fixedRoutes,
    ...courses.map(course => ({ path: `/courses/${course.id}`, title: `${course.title} Course | Knowlect`, description: course.description })),
    ...mentors.map(mentor => ({ path: `/instructors/${mentorSlug(mentor.name)}`, title: `${mentor.name} | Knowlect Instructors`, description: mentor.bio })),
    ...articles.map(article => ({ path: `/blog/${article.slug}`, title: `${article.title} | Knowlect Journal`, description: article.excerpt })),
  ];
}

const unknownMetadata = (path: string): RouteMetadata => ({ path, title: 'Page Not Found | Knowlect', description: 'The requested Knowlect page could not be found.', robots: 'noindex,nofollow' });

export function getRouteMetadata(path: string): RouteMetadata {
  const normalized = normalizePath(path);
  return allPrerenderedRoutes().find(route => route.path === normalized) ?? unknownMetadata(normalized);
}

export function resolveRoute(path: string): ResolvedRoute {
  const normalized = normalizePath(path);
  const exact = (routePath: string) => normalized === routePath;
  const exactMeta = fixedRoutes.find(route => route.path === normalized) ?? null;
  if (exact('/')) return { ...fixedRoutes[0], content: null, notFound: false };
  if (exact('/courses')) return { ...fixedRoutes[1], content: <CoursesPage />, notFound: false };
  if (exact('/about')) return { ...fixedRoutes[2], content: <AboutPage />, notFound: false };
  if (exact('/testimonials')) return { ...fixedRoutes[3], content: <TestimonialsPage />, notFound: false };
  if (exact('/instructors')) return { ...fixedRoutes[4], content: <InstructorsPage />, notFound: false };
  if (exact('/contact')) return { ...fixedRoutes[5], content: <ContactPage />, notFound: false };
  if (exact('/blog')) return { ...fixedRoutes[6], content: <BlogPage />, notFound: false };
  if (exact('/faq')) return { ...fixedRoutes[7], content: <FaqPage faqs={faqs} />, notFound: false };
  if (exact('/privacy')) return { ...fixedRoutes[8], content: <LegalPage kind="privacy" />, notFound: false };
  if (exact('/terms')) return { ...fixedRoutes[9], content: <LegalPage kind="terms" />, notFound: false };
  if (exact('/dashboard')) return { ...fixedRoutes[11], content: <DashboardPage />, notFound: false };
  const courseMatch = normalized.match(/^\/courses\/([^/]+)$/);
  if (courseMatch) {
    const course = courses.find(item => item.id === safeDecode(courseMatch[1]));
    if (course) return { path: normalized, title: `${course.title} Course | Knowlect`, description: course.description, content: <CourseDetailPage course={course} />, notFound: false };
  }
  const mentorMatch = normalized.match(/^\/instructors\/([^/]+)$/);
  if (mentorMatch) {
    const mentor = mentors.find(item => mentorSlug(item.name) === safeDecode(mentorMatch[1]));
    if (mentor) return { path: normalized, title: `${mentor.name} | Knowlect Instructors`, description: mentor.bio, content: <InstructorDetailPage mentor={mentor} />, notFound: false };
  }
  const articleMatch = normalized.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articles.find(item => item.slug === safeDecode(articleMatch[1]));
    if (article) return { path: normalized, title: `${article.title} | Knowlect Journal`, description: article.excerpt, content: <ArticlePage slug={article.slug} />, notFound: false };
  }
  if (exact('/404')) return { ...fixedRoutes[10], content: <NotFoundPage path={normalized} />, notFound: true };
  const metadata = exactMeta ?? unknownMetadata(normalized);
  return { ...metadata, content: <NotFoundPage path={normalized} />, notFound: true };
}

export function getDeclaredRoutePatterns(): RouteDeclaration[] {
  return [
    ...fixedRoutes.filter(route => route.path !== '/404'),
    { path: '/courses/:courseSlug', title: 'Course detail' },
    { path: '/instructors/:mentorSlug', title: 'Instructor profile' },
    { path: '/blog/:articleSlug', title: 'Journal article' },
  ];
}
