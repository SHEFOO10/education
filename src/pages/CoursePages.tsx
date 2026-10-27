import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Clock3, ListFilter, Search, Sparkles } from 'lucide-react';
import type { Course, Category } from '../data';
import { courses, mentors } from '../data';
import { asset, BottomCta, EmptyState, PageHero, PageReveal, SectionIntro } from '../components/site/PageShared';
import './course-pages.css';

const courseCategories: Category[] = ['All Courses', 'UI/UX Design', 'Development', 'Marketing', 'Graphic Design'];
const savedCoursesKey = 'knowlect-saved-courses';
type SortOrder = 'featured' | 'price-low' | 'price-high' | 'duration';

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'duration', label: 'Shortest duration' },
];

function isCourseCategory(value: string | null): value is Category {
  return Boolean(value && courseCategories.includes(value as Category));
}

function toMinutes(duration: string) {
  const hours = Number(duration.match(/(\d+)hr/)?.[1] ?? 0);
  const minutes = Number(duration.match(/(\d+)mn/)?.[1] ?? 0);
  return hours * 60 + minutes;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function courseMatches(course: Course, query: string) {
  const haystack = [course.title, course.category, course.description, ...course.topics].join(' ').toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <PageReveal className="catalog-card-reveal" delay={index * 0.04}>
      <article className="catalog-card">
        <a className="catalog-card-art" href={`/courses/${course.id}`} aria-label={`View ${course.title} course`}>
          <img src={asset(course.image)} alt={`${course.title} course artwork`} loading={index > 1 ? 'lazy' : 'eager'} />
          <span className="catalog-card-link">View course <ArrowRight size={16} aria-hidden="true" /></span>
        </a>
        <div className="catalog-card-body">
          <div className="catalog-card-heading">
            <p className="catalog-card-category">{course.category}</p>
            <span className="catalog-card-price">${course.price}</span>
          </div>
          <h3><a href={`/courses/${course.id}`}>{course.title}</a></h3>
          <p className="catalog-card-description">{course.description}</p>
          <div className="catalog-card-meta" aria-label={`${course.lessons} lessons, ${course.duration}`}>
            <span><BookOpen size={16} aria-hidden="true" /> {course.lessons} lessons</span>
            <span><Clock3 size={16} aria-hidden="true" /> {course.duration}</span>
          </div>
        </div>
      </article>
    </PageReveal>
  );
}

export function CoursesPage() {
  const [category, setCategory] = useState<Category>('All Courses');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOrder>('featured');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('category');
    const requestedQuery = params.get('q');
    if (isCourseCategory(requestedCategory)) setCategory(requestedCategory);
    if (requestedQuery) setQuery(requestedQuery);
  }, []);

  const visibleCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const categoryMatches = category === 'All Courses' || course.category === category;
      return categoryMatches && courseMatches(course, query);
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'duration') return toMinutes(a.duration) - toMinutes(b.duration);
      return courses.indexOf(a) - courses.indexOf(b);
    });
  }, [category, query, sort]);

  return (
    <div className="course-page catalog-route">
      <PageHero
        eyebrow="Courses"
        title={<>A thoughtful place to<br />begin learning.</>}
        description="Explore practical courses for the skills you want to carry into your next chapter."
      >
        <div className="catalog-hero-note"><Sparkles size={17} aria-hidden="true" /> Four focused courses, designed to be taken at your pace.</div>
      </PageHero>

      <section className="catalog-page content-section" id="main-content">
        <div className="inner">
          <SectionIntro
            eyebrow="THE CATALOG"
            title="Find the skill that feels like yours."
            description="Search the full Knowlect catalog or browse by discipline. Each course keeps the path clear, practical, and focused."
          />

          <section className="catalog-controls" aria-label="Course catalog filters">
            <div className="catalog-search-wrap">
              <label htmlFor="course-search">Search courses</label>
              <div className="catalog-search-field">
                <Search size={18} aria-hidden="true" />
                <input
                  id="course-search"
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search by title, topic, or category"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="catalog-sort-wrap">
              <label htmlFor="course-sort"><ListFilter size={16} aria-hidden="true" /> Sort by</label>
              <div className="catalog-select-wrap">
                <select id="course-sort" value={sort} onChange={event => setSort(event.target.value as SortOrder)}>
                  {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </div>
            </div>
          </section>

          <div className="catalog-category-bar" role="group" aria-label="Filter by course category">
            {courseCategories.map(item => (
              <button
                key={item}
                type="button"
                className={category === item ? 'catalog-category-button is-active' : 'catalog-category-button'}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="catalog-results-heading">
            <p aria-live="polite"><strong>{visibleCourses.length}</strong> {visibleCourses.length === 1 ? 'course' : 'courses'}{query || category !== 'All Courses' ? ' found' : ''}</p>
            {(query || category !== 'All Courses') && <button type="button" onClick={() => { setQuery(''); setCategory('All Courses'); }}>Clear filters</button>}
          </div>

          {visibleCourses.length > 0 ? (
            <div className="catalog-grid">
              {visibleCourses.map((course, index) => <CourseCard key={course.id} course={course} index={index} />)}
            </div>
          ) : (
            <EmptyState
              title="No courses match that search."
              description="Try a different keyword or clear the filters to see every course in the catalog."
              action={<button className="button outline" type="button" onClick={() => { setQuery(''); setCategory('All Courses'); }}>Show all courses</button>}
            />
          )}
        </div>
      </section>

      <BottomCta
        title="Keep a course close for later."
        text="Save a course to your learning list on this device whenever you find a path worth returning to."
        href="#course-search"
        label="Search the catalog"
      />
    </div>
  );
}

function InstructorLink({ course }: { course: Course }) {
  const instructor = mentors.find(mentor => mentor.expertise === course.category);
  if (!instructor) return null;

  return (
    <a className="course-detail-instructor" href={`/instructors/${slugify(instructor.name)}`}>
      <img src={asset(instructor.image)} alt="" loading="lazy" />
      <span><small>Instructor</small><strong>{instructor.name}</strong></span>
      <ArrowRight size={17} aria-hidden="true" />
    </a>
  );
}

function Curriculum({ course }: { course: Course }) {
  const [openTopic, setOpenTopic] = useState(0);

  return (
    <div className="course-detail-curriculum" aria-label={`${course.title} curriculum`}>
      {course.topics.map((topic, index) => {
        const isOpen = openTopic === index;
        const panelId = `${course.id}-topic-${index}`;
        return (
          <div className={isOpen ? 'course-detail-module is-open' : 'course-detail-module'} key={topic}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenTopic(isOpen ? -1 : index)}>
                <span className="course-detail-module-number">0{index + 1}</span>
                <span>{topic}</span>
                <ChevronDown size={19} aria-hidden="true" />
              </button>
            </h3>
            <div className="course-detail-module-panel" id={panelId} hidden={!isOpen}>
              <p>This course section is centered on {topic.toLowerCase()}.</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CourseDetailPage({ course }: { course: Course }) {
  const [saved, setSaved] = useState(false);
  const relatedCourses = courses.filter(candidate => candidate.id !== course.id);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(savedCoursesKey) || '[]') as unknown;
      setSaved(Array.isArray(stored) && stored.includes(course.id));
    } catch {
      setSaved(false);
    }
  }, [course.id]);

  const saveCourse = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(savedCoursesKey) || '[]') as unknown;
      const ids = Array.isArray(stored) ? stored.filter((value): value is string => typeof value === 'string') : [];
      window.localStorage.setItem(savedCoursesKey, JSON.stringify([...new Set([...ids, course.id])]));
      setSaved(true);
    } catch {
      setSaved(true);
    }
  };

  return (
    <div className="course-page course-detail-route">
      <PageHero
        eyebrow={course.category}
        title={course.title}
        description={course.description}
      >
        <div className="course-detail-hero-meta">
          <span><BookOpen size={16} aria-hidden="true" /> {course.lessons} lessons</span>
          <span><Clock3 size={16} aria-hidden="true" /> {course.duration}</span>
          <span className="course-detail-hero-price">${course.price}</span>
        </div>
      </PageHero>

      <section className="course-detail-page" id="main-content">
        <div className="inner">
          <div className="course-detail-layout">
            <div className="course-detail-main">
              <PageReveal className="course-detail-art-wrap">
                <img className="course-detail-art" src={asset(course.image)} alt={`${course.title} course artwork`} />
              </PageReveal>

              <section className="course-detail-section course-detail-overview" aria-labelledby="course-overview-title">
                <SectionIntro
                  eyebrow="THE OVERVIEW"
                  title={<span id="course-overview-title">A clear route from curiosity to practice.</span>}
                  description={course.description}
                />
                <div className="course-detail-overview-copy">
                  <p>Work through a focused set of lessons that gives the subject room to become useful. Return to the material whenever you want a refresher.</p>
                  <InstructorLink course={course} />
                </div>
              </section>

              <section className="course-detail-section" aria-labelledby="course-outcomes-title">
                <SectionIntro
                  eyebrow="WHAT YOU'LL WORK ON"
                  title={<span id="course-outcomes-title">Practical ideas to take with you.</span>}
                  description="The course topics keep each session connected to a tangible skill or next step."
                />
                <div className="course-detail-outcomes">
                  {course.topics.map((topic, index) => (
                    <div className="course-detail-outcome" key={topic}>
                      <span className="course-detail-outcome-icon"><Check size={18} aria-hidden="true" /></span>
                      <div><span>0{index + 1}</span><h3>{topic}</h3></div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="course-detail-section" aria-labelledby="course-curriculum-title">
                <SectionIntro
                  eyebrow="THE CURRICULUM"
                  title={<span id="course-curriculum-title">Take it one lesson at a time.</span>}
                  description={`${course.lessons} lessons · ${course.duration}. Open a topic to see its place in the course.`}
                />
                <Curriculum course={course} />
              </section>
            </div>

            <aside className="course-detail-summary" aria-label="Learning summary">
              <div className="course-detail-summary-card">
                <p className="eyebrow">LEARNING SUMMARY</p>
                <div className="course-detail-summary-price">${course.price}<span> / course</span></div>
                <div className="course-detail-summary-facts">
                  <span><BookOpen size={17} aria-hidden="true" /><strong>{course.lessons}</strong> lessons</span>
                  <span><Clock3 size={17} aria-hidden="true" /><strong>{course.duration}</strong></span>
                </div>
                <button type="button" className="button primary course-detail-save" onClick={saveCourse} aria-pressed={saved}>
                  {saved ? <><Check size={17} aria-hidden="true" /> Saved to learning list</> : 'Save to my learning list'}
                </button>
                <p className="course-detail-disclosure">Saved only in this browser. Enrollment and payment backend are not connected, so this page does not process checkout.</p>
                <a className="course-detail-back-link" href="/courses"><ArrowLeft size={16} aria-hidden="true" /> Back to all courses</a>
              </div>
            </aside>
          </div>

          <section className="course-detail-related" aria-labelledby="related-courses-title">
            <SectionIntro
              eyebrow="KEEP EXPLORING"
              title={<span id="related-courses-title">More ways to keep learning.</span>}
              description="If this course caught your attention, another focused path may be a good next step."
            />
            <div className="catalog-grid course-detail-related-grid">
              {relatedCourses.map((related, index) => <CourseCard key={related.id} course={related} index={index} />)}
            </div>
          </section>
        </div>
      </section>

      <BottomCta
        title="A small step can change the shape of your week."
        text="Keep exploring the Knowlect catalog and choose the course that matches your curiosity today."
        href="/courses"
        label="Explore all courses"
      />
    </div>
  );
}

export default CoursesPage;
