import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Compass,
  ListChecks,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import type { Course } from '../data';
import { courses } from '../data';
import { asset } from '../components/site/PageShared';
import { lessonsFor, toggleLesson, useLearningState, type Enrollment } from '../learning';
import './dashboard-page.css';

const savedCoursesKey = 'knowlect-saved-courses';
type CourseFilter = 'all' | 'in-progress' | 'completed';

function getCourse(courseId: string) {
  return courses.find(course => course.id === courseId);
}

function completionFor(course: Course, enrollment: Enrollment) {
  return Math.min(100, Math.round((enrollment.completedLessons.length / course.lessons) * 100));
}

function formatDate(value: string) {
  if (!value) return 'Recently added';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently added';
  return `Added ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)}`;
}

function CourseProgress({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  const percentage = completionFor(course, enrollment);
  return (
    <div className="student-dashboard__progress">
      <div className="student-dashboard__progress-label">
        <span>Self-tracked progress</span>
        <strong>{percentage}%</strong>
      </div>
      <progress value={percentage} max={100} aria-label={`${course.title}: ${percentage}% self-tracked progress`} />
      <span className="student-dashboard__progress-note">{enrollment.completedLessons.length} of {course.lessons} lessons checked</span>
    </div>
  );
}

function EnrolledCourseCard({
  course,
  enrollment,
  selected,
  onSelect,
}: {
  course: Course;
  enrollment: Enrollment;
  selected: boolean;
  onSelect: () => void;
}) {
  const percentage = completionFor(course, enrollment);
  return (
    <article className={selected ? 'student-dashboard__course-card is-selected' : 'student-dashboard__course-card'}>
      <a className="student-dashboard__course-art" href={`/courses/${course.id}`} aria-label={`Open ${course.title} course details`}>
        <img src={asset(course.image)} alt={`${course.title} course artwork`} loading="lazy" />
        <span className="student-dashboard__course-art-link">View course <ArrowRight size={15} aria-hidden="true" /></span>
      </a>
      <div className="student-dashboard__course-copy">
        <div className="student-dashboard__course-heading">
          <div>
            <p className="student-dashboard__course-category">{course.category}</p>
            <h3><a href={`/courses/${course.id}`}>{course.title}</a></h3>
          </div>
          {percentage === 100 && <span className="student-dashboard__complete-badge"><Check size={13} aria-hidden="true" /> Complete</span>}
        </div>
        <div className="student-dashboard__course-meta">
          <span><BookOpen size={15} aria-hidden="true" /> {course.lessons} lessons</span>
          <span><Clock3 size={15} aria-hidden="true" /> {course.duration}</span>
          <span>{formatDate(enrollment.enrolledAt)}</span>
        </div>
        <CourseProgress course={course} enrollment={enrollment} />
        <button className="student-dashboard__text-button" type="button" onClick={onSelect} aria-pressed={selected}>
          {selected ? 'Learning focus selected' : 'Open learning focus'} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function SavedCourseCard({ course }: { course: Course }) {
  return (
    <article className="student-dashboard__saved-card">
      <a href={`/courses/${course.id}`} aria-label={`View ${course.title}`}>
        <img src={asset(course.image)} alt="" loading="lazy" />
        <span>
          <small>{course.category}</small>
          <strong>{course.title}</strong>
          <em>Explore course <ArrowRight size={14} aria-hidden="true" /></em>
        </span>
      </a>
    </article>
  );
}

export function DashboardPage() {
  const { state, ready, error } = useLearningState();
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [savedReady, setSavedReady] = useState(false);
  const [savedError, setSavedError] = useState('');
  const [localStatus, setLocalStatus] = useState('');

  useEffect(() => {
    if (!ready) return;
    const requestedCourse = new URLSearchParams(window.location.search).get('course');
    const requestedEnrollment = requestedCourse ? state.enrollments.find(entry => entry.courseId === requestedCourse) : undefined;
    setSelectedCourseId(current => state.enrollments.some(entry => entry.courseId === current) ? current : requestedEnrollment?.courseId ?? state.enrollments[0]?.courseId ?? null);
  }, [ready, state.enrollments]);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(savedCoursesKey) || '[]') as unknown;
      setSavedCourseIds(Array.isArray(stored) ? stored.filter((value): value is string => typeof value === 'string' && Boolean(getCourse(value))) : []);
      setSavedError('');
    } catch {
      setSavedCourseIds([]);
      setSavedError('Saved courses could not be read from this browser. Nothing was changed.');
    } finally {
      setSavedReady(true);
    }
  }, []);

  const enrollmentRows = useMemo(() => state.enrollments.flatMap(enrollment => {
    const course = getCourse(enrollment.courseId);
    return course ? [{ course, enrollment, percentage: completionFor(course, enrollment) }] : [];
  }), [state.enrollments]);

  const filteredRows = useMemo(() => enrollmentRows.filter(row => {
    if (filter === 'completed') return row.percentage === 100;
    if (filter === 'in-progress') return row.percentage < 100;
    return true;
  }), [enrollmentRows, filter]);

  const selectedRow = enrollmentRows.find(row => row.course.id === selectedCourseId) ?? enrollmentRows[0];
  const selectedLessons = selectedRow ? lessonsFor(selectedRow.course) : [];
  const selectedCompleted = new Set(selectedRow?.enrollment.completedLessons ?? []);
  const completedLessons = enrollmentRows.reduce((total, row) => total + row.enrollment.completedLessons.length, 0);
  const totalLessons = enrollmentRows.reduce((total, row) => total + row.course.lessons, 0);
  const completedCourses = enrollmentRows.filter(row => row.percentage === 100).length;
  const inProgressCourses = enrollmentRows.filter(row => row.percentage < 100).length;
  const savedCourses = savedCourseIds.map(getCourse).filter((course): course is Course => Boolean(course));
  const learnerName = state.profile?.name?.trim();

  const continueLearning = () => {
    if (!selectedRow) return;
    const nextLesson = selectedLessons.find(lesson => !selectedCompleted.has(lesson.index)) ?? selectedLessons[0];
    if (!nextLesson) return;
    const lessonInput = document.getElementById(`lesson-${selectedRow.course.id}-${nextLesson.index}`);
    lessonInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (lessonInput instanceof HTMLInputElement) window.setTimeout(() => lessonInput.focus(), 240);
  };

  const toggleTrackedLesson = (courseId: string, index: number, completed: boolean) => {
    try {
      toggleLesson(courseId, index);
      setLocalStatus(completed ? 'Lesson marked as in progress on this browser.' : 'Lesson marked complete on this browser.');
    } catch (err) {
      setLocalStatus(err instanceof Error ? err.message : 'This lesson could not be saved. Nothing was changed.');
    }
  };

  if (!ready) {
    return (
      <div className="student-dashboard student-dashboard--loading" aria-busy="true">
        <div className="student-dashboard__hero"><div className="student-dashboard__inner"><span className="student-dashboard__loading-line" /><span className="student-dashboard__loading-title" /><span className="student-dashboard__loading-copy" /></div></div>
        <div className="student-dashboard__inner"><div className="student-dashboard__loading-panel"><RotateCcw size={18} aria-hidden="true" /> Preparing your local learning space…</div></div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <section className="student-dashboard__hero" aria-labelledby="student-dashboard-title">
        <div className="student-dashboard__inner">
          <div className="student-dashboard__hero-topline">
            <p className="student-dashboard__eyebrow">Student dashboard</p>
            <span className="student-dashboard__local-pill"><span aria-hidden="true" /> Saved only in this browser</span>
          </div>
          <div className="student-dashboard__hero-grid">
            <div>
              <h1 id="student-dashboard-title">{learnerName ? <>Keep going, <em>{learnerName}</em>.</> : <>Make a little room<br />for learning.</>}</h1>
              <p className="student-dashboard__hero-copy">A calm place to return to your courses, pick up a lesson, and see the progress you choose to track.</p>
            </div>
            <div className="student-dashboard__hero-note">
              <Sparkles size={20} aria-hidden="true" />
              <p><strong>Your pace, your record.</strong><br />This workspace is not an authenticated account and progress is not verified learning.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="student-dashboard__inner student-dashboard__body">
        <nav className="student-dashboard__workspace-nav" aria-label="Dashboard sections">
          <span className="student-dashboard__workspace-label">Workspace</span>
          <a href="#overview">Overview</a>
          <a href="#mycourses">My courses</a>
          <a href={selectedRow ? "#lesson-tracker" : "#mycourses"}>Lesson tracker</a>
          <a href="#savedcourses">Saved courses</a>
        </nav>

        {error && <div className="student-dashboard__alert" role="alert"><CircleAlert size={18} aria-hidden="true" /><span>{error}</span></div>}
        {localStatus && <div className="student-dashboard__status" role="status" aria-live="polite"><CheckCircle2 size={17} aria-hidden="true" /><span>{localStatus}</span><button type="button" aria-label="Dismiss status" onClick={() => setLocalStatus('')}>×</button></div>}

        <section className="student-dashboard__overview" id="overview" aria-labelledby="overview-title">
          <div className="student-dashboard__section-heading">
            <div><p className="student-dashboard__eyebrow">A useful snapshot</p><h2 id="overview-title">Your learning, at a glance.</h2></div>
            <p>Only the courses and lesson checkmarks saved in this browser appear here.</p>
          </div>
          <div className="student-dashboard__metrics">
            <div className="student-dashboard__metric"><span><BookOpen size={18} aria-hidden="true" /></span><strong>{enrollmentRows.length}</strong><p>Courses enrolled</p></div>
            <div className="student-dashboard__metric"><span><ListChecks size={18} aria-hidden="true" /></span><strong>{completedLessons}<small>/{totalLessons}</small></strong><p>Lessons checked</p></div>
            <div className="student-dashboard__metric"><span><Target size={18} aria-hidden="true" /></span><strong>{inProgressCourses}</strong><p>In progress</p></div>
            <div className="student-dashboard__metric"><span><CheckCircle2 size={18} aria-hidden="true" /></span><strong>{completedCourses}<small>/{enrollmentRows.length}</small></strong><p>Courses complete</p></div>
          </div>
        </section>

        <div className={selectedRow ? 'student-dashboard__columns' : 'student-dashboard__columns is-empty'}>
          <div className="student-dashboard__main-column">
            <section className="student-dashboard__section" id="mycourses" aria-labelledby="mycourses-title">
              <div className="student-dashboard__section-heading student-dashboard__section-heading--compact">
                <div><p className="student-dashboard__eyebrow">Your shelf</p><h2 id="mycourses-title">My courses.</h2></div>
                {enrollmentRows.length > 0 && <div className="student-dashboard__filters" role="group" aria-label="Filter enrolled courses">
                  {(['all', 'in-progress', 'completed'] as CourseFilter[]).map(option => <button key={option} type="button" className={filter === option ? 'is-active' : ''} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option === 'all' ? 'All' : option === 'in-progress' ? 'In progress' : 'Completed'}</button>)}
                </div>}
              </div>

              {enrollmentRows.length === 0 ? (
                <div className="student-dashboard__empty">
                  <div className="student-dashboard__empty-icon"><Compass size={24} aria-hidden="true" /></div>
                  <p className="student-dashboard__eyebrow">A fresh start is a good start</p>
                  <h3>Your course shelf is waiting for its first course.</h3>
                  <p>Browse the catalog when you’re ready. Registering on a course detail page will add it here with zero progress. Nothing is pre-filled for you.</p>
                  <div className="student-dashboard__empty-actions"><a className="button primary" href="/courses">Browse courses <ArrowRight size={16} aria-hidden="true" /></a><a className="button outline" href="#savedcourses">See saved courses</a></div>
                </div>
              ) : filteredRows.length === 0 ? (
                <div className="student-dashboard__filter-empty"><h3>No {filter === 'completed' ? 'completed' : 'in-progress'} courses yet.</h3><p>Change the filter to see the rest of your learning shelf.</p><button className="student-dashboard__text-button" type="button" onClick={() => setFilter('all')}>Show all courses <ArrowRight size={15} aria-hidden="true" /></button></div>
              ) : (
                <div className="student-dashboard__course-list">{filteredRows.map(row => <CourseProgressCard key={row.course.id} row={row} selected={selectedRow?.course.id === row.course.id} onSelect={() => setSelectedCourseId(row.course.id)} />)}</div>
              )}
            </section>

            <section className="student-dashboard__section" id="savedcourses" aria-labelledby="savedcourses-title">
              <div className="student-dashboard__section-heading student-dashboard__section-heading--compact"><div><p className="student-dashboard__eyebrow">Keep curiosity close</p><h2 id="savedcourses-title">Saved courses.</h2></div><a className="student-dashboard__text-button" href="/courses">Explore catalog <ArrowRight size={15} aria-hidden="true" /></a></div>
              {savedError && <div className="student-dashboard__inline-alert" role="alert"><CircleAlert size={16} aria-hidden="true" />{savedError}</div>}
              {!savedReady ? <p className="student-dashboard__muted">Checking your saved courses…</p> : savedCourses.length > 0 ? <div className="student-dashboard__saved-grid">{savedCourses.map(course => <SavedCourseCard key={course.id} course={course} />)}</div> : <div className="student-dashboard__saved-empty"><Bookmark size={19} aria-hidden="true" /><p>No saved courses yet. When a course catches your eye, save it from its course page.</p><a href="/courses">Find a course <ArrowRight size={15} aria-hidden="true" /></a></div>}
            </section>
          </div>

          {selectedRow && <aside className="student-dashboard__focus" id="lesson-tracker" aria-labelledby="learning-focus-title">
            <div className="student-dashboard__focus-heading"><div><p className="student-dashboard__eyebrow">Learning focus</p><h2 id="learning-focus-title">One next step.</h2></div><span className="student-dashboard__focus-mark"><ListChecks size={18} aria-hidden="true" /></span></div>
            <a className="student-dashboard__focus-course" href={`/courses/${selectedRow.course.id}`}><img src={asset(selectedRow.course.image)} alt="" /><span><small>{selectedRow.course.category}</small><strong>{selectedRow.course.title}</strong></span><ArrowRight size={17} aria-hidden="true" /></a>
            <CourseProgress course={selectedRow.course} enrollment={selectedRow.enrollment} />
            <button className="button primary student-dashboard__continue" type="button" onClick={continueLearning}>{selectedRow.percentage === 100 ? 'Review lessons' : 'Continue learning'} <ArrowRight size={16} aria-hidden="true" /></button>
            <div className="student-dashboard__checklist-heading"><h3>Lesson tracker</h3><span>{selectedCompleted.size}/{selectedLessons.length}</span></div>
            <div className="student-dashboard__lesson-list" aria-label={`${selectedRow.course.title} lesson checklist`}>
              {selectedLessons.map(lesson => {
                const completed = selectedCompleted.has(lesson.index);
                const isNext = !completed && !selectedLessons.slice(0, lesson.index).some(item => !selectedCompleted.has(item.index));
                return <label className={completed ? 'student-dashboard__lesson is-complete' : isNext ? 'student-dashboard__lesson is-next' : 'student-dashboard__lesson'} key={lesson.index} htmlFor={`lesson-${selectedRow.course.id}-${lesson.index}`}><input id={`lesson-${selectedRow.course.id}-${lesson.index}`} type="checkbox" checked={completed} onChange={() => toggleTrackedLesson(selectedRow.course.id, lesson.index, completed)} /><span className="student-dashboard__lesson-check" aria-hidden="true"><Check size={13} /></span><span className="student-dashboard__lesson-copy"><strong>{lesson.title}</strong><small>{lesson.module}</small></span></label>;
              })}
            </div>
            <p className="student-dashboard__self-tracked-note"><CheckCircle2 size={15} aria-hidden="true" /> 100% means self-tracked completion, not a verified certificate.</p>
          </aside>}
        </div>

        <div className="student-dashboard__privacy-note"><CircleAlert size={16} aria-hidden="true" /><p><strong>Private to this browser.</strong> Your profile and progress are saved only on this device. Knowlect is not connecting this workspace to an authenticated account or verifying course completion.</p></div>
      </div>
    </div>
  );
}

function CourseProgressCard({ row, selected, onSelect }: { row: { course: Course; enrollment: Enrollment; percentage: number }; selected: boolean; onSelect: () => void }) {
  return <EnrolledCourseCard course={row.course} enrollment={row.enrollment} selected={selected} onSelect={onSelect} />;
}
