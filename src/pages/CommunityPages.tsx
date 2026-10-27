import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Clock3, Mail, Search, SlidersHorizontal } from 'lucide-react';
import { courses, mentors, steps, testimonials, type Mentor, type Testimonial } from '../data';
import { asset, BottomCta, EmptyState, PageHero, PageReveal, SectionIntro } from '../components/site/PageShared';
import './community-pages.css';

export const mentorSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const testimonialDiscipline = (story: Testimonial) => {
  if (story.role.includes('UX')) return 'UI/UX Design';
  if (story.role.includes('Frontend')) return 'Development';
  if (story.role.includes('Graphic')) return 'Graphic Design';
  return 'Marketing';
};

const principles = [
  { number: '01', title: 'Useful before impressive', text: 'We keep learning practical, with clear lessons and projects that help an idea become a skill.' },
  { number: '02', title: 'Progress has many paces', text: 'Learning should fit around real life. Our self-paced format gives you room to pause, practice, and return.' },
  { number: '03', title: 'Guidance makes the difference', text: 'A thoughtful mentor can make the next step feel possible. We make room for questions, feedback, and encouragement.' },
];

function StoryCard({ story, expanded, onToggle }: { story: Testimonial; expanded: boolean; onToggle: () => void }) {
  const imageName = ('image' in story && story.image) || ('avatar' in story && story.avatar) || 'avatar-ayaan';
  return (
    <PageReveal className={`stories-card ${expanded ? 'is-expanded' : ''}`}>
      <button className="stories-card-trigger" type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={`story-${story.name.replace(/\s+/g, '-').toLowerCase()}`}>
        <div className="stories-card-media">
          <img src={asset(imageName)} alt={`${story.name}, ${story.role}`} />
          {'image' in story && <span className="stories-media-label">Read the full story <ArrowRight size={16} /></span>}
        </div>
        <div className="stories-card-copy">
          <div className="stories-author">
            <span className="stories-author-dot" aria-hidden="true" />
            <div><h3>{story.name}</h3><p>{story.role}</p></div>
          </div>
          <p className="stories-quote">“{story.quote}”</p>
          <span className="stories-card-action">{expanded ? 'Hide story' : 'Read full story'} <ArrowRight size={15} /></span>
        </div>
      </button>
      {expanded && <div className="stories-expanded" id={`story-${story.name.replace(/\s+/g, '-').toLowerCase()}`} role="region" aria-label={`${story.name}'s full learning story`}><p>“{story.quote}”</p><span>{story.role} · learner story</span></div>}
    </PageReveal>
  );
}

export function AboutPage() {
  return (
    <div className="community-page about-page">
      <PageHero eyebrow="About Knowlect" title={<>Make space for<br /><em>what’s next.</em></>} description="Knowlect is a place to build useful skills with thoughtful courses, clear practice, and mentors who care about your progress."><div className="about-hero-note"><span className="about-hero-mark" aria-hidden="true">✦</span><p>Learning feels different when every lesson leads somewhere.</p></div></PageHero>

      <section className="content-section about-mission"><div className="inner about-mission-grid"><PageReveal className="about-mission-label"><p className="eyebrow">OUR POINT OF VIEW</p><span>01 / 04</span></PageReveal><PageReveal className="about-mission-copy"><h2>Skills become meaningful when they help you move through the world with more confidence.</h2><p>We bring together approachable courses and human guidance for learners who want to begin, change direction, or keep growing. No grand promises—just a clear next step and the support to take it.</p></PageReveal></div></section>

      <section className="content-section about-journey"><div className="inner"><SectionIntro eyebrow="A SIMPLE PATH" title="Learn in a way that keeps momentum close." description="From choosing a direction to celebrating what you can now make, the Knowlect journey is designed to feel clear and encouraging." /><div className="about-steps">{steps.map((step, index) => <PageReveal key={step.number} className="about-step" delay={index * 0.07}><div className="about-step-image"><img src={asset(step.image)} alt="" loading="lazy" /><span>{step.number}</span></div><div><p className="eyebrow">{step.number}</p><h3>{step.title}</h3><p>{step.description}</p></div></PageReveal>)}</div></div></section>

      <section className="content-section about-principles"><div className="inner"><SectionIntro eyebrow="WHAT WE VALUE" title="A learning experience with room to be human." /><div className="principles-grid">{principles.map((principle, index) => <PageReveal key={principle.number} className="principle-card" delay={index * 0.06}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p></PageReveal>)}</div></div></section>

      <section className="content-section about-mentor-cta"><div className="inner about-mentor-card"><PageReveal><p className="eyebrow">LEARN WITH GUIDANCE</p><h2>Meet the people who make the next step feel possible.</h2><p>Explore the mentors behind our courses and find an approach that feels right for you.</p><a className="button primary" href="/instructors">Meet our instructors <ArrowRight size={17} /></a></PageReveal><PageReveal className="about-mentor-stamp" delay={0.1}><span>Curiosity</span><strong>→</strong><span>Practice</span><strong>→</strong><span>Confidence</span></PageReveal></div></section>
      <BottomCta title="Keep your curiosity moving." text="Find a course that gives your next idea a place to grow." href="/courses" label="Explore our courses" />
    </div>
  );
}

export function TestimonialsPage() {
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState('All disciplines');
  const [expanded, setExpanded] = useState<string | null>(null);
  const disciplines = ['All disciplines', ...Array.from(new Set(testimonials.map(testimonialDiscipline)))];
  const filteredStories = useMemo(() => testimonials.filter(story => {
    const matchesDiscipline = discipline === 'All disciplines' || testimonialDiscipline(story) === discipline;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${story.name} ${story.role} ${story.quote}`.toLowerCase().includes(normalizedQuery);
    return matchesDiscipline && matchesQuery;
  }), [discipline, query]);

  return (
    <div className="community-page stories-page">
      <PageHero eyebrow="Learner stories" title={<>Small steps.<br /><em>Real change.</em></>} description="Read what learners found when they made time for a new skill. These are their words, at their own pace."><div className="stories-hero-aside"><span>04</span><p>learner stories<br />to explore</p></div></PageHero>
      <section className="content-section stories-content"><div className="inner"><SectionIntro eyebrow="FROM THE COMMUNITY" title="Stories from the learning journey." description="Filter by discipline or search the words that feel familiar. Every story is shared as a written learner reflection." /><div className="stories-filters" aria-label="Filter learner stories"><label className="stories-search"><Search size={18} aria-hidden="true" /><span className="accessible-only">Search learner stories</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search stories" /></label><div className="stories-disciplines"><SlidersHorizontal size={17} aria-hidden="true" />{disciplines.map(item => <button key={item} type="button" className={discipline === item ? 'is-selected' : ''} aria-pressed={discipline === item} onClick={() => setDiscipline(item)}>{item}</button>)}</div></div>{filteredStories.length ? <div className="stories-grid">{filteredStories.map(story => <StoryCard key={story.name} story={story} expanded={expanded === story.name} onToggle={() => setExpanded(expanded === story.name ? null : story.name)} />)}</div> : <EmptyState title="No stories found" description="Try another search term or explore every discipline." action={<button className="button outline" type="button" onClick={() => { setQuery(''); setDiscipline('All disciplines'); }}>Clear filters</button>} />}</div></section>
      <BottomCta title="Your story can start with one lesson." text="Choose a course that meets you where you are and take the next step when you’re ready." href="/courses" label="Find your course" />
    </div>
  );
}

export function InstructorsPage() {
  const [query, setQuery] = useState('');
  const [expertise, setExpertise] = useState('All expertise');
  const expertiseOptions = ['All expertise', ...Array.from(new Set(mentors.map(mentor => mentor.expertise)))];
  const filteredMentors = useMemo(() => mentors.filter(mentor => {
    const normalizedQuery = query.trim().toLowerCase();
    return (expertise === 'All expertise' || mentor.expertise === expertise) && (!normalizedQuery || `${mentor.name} ${mentor.role} ${mentor.bio} ${mentor.expertise}`.toLowerCase().includes(normalizedQuery));
  }), [expertise, query]);

  return (
    <div className="community-page instructors-page">
      <PageHero eyebrow="Our instructors" title={<>Meet the people<br /><em>behind the practice.</em></>} description="Thoughtful guidance can turn a difficult first step into a repeatable way of learning. Get to know the mentors who shape our courses." />
      <section className="content-section instructors-content"><div className="inner"><SectionIntro eyebrow="THE MENTOR DIRECTORY" title="Find an approach that fits you." description="Browse by expertise, then open a profile to learn more about each mentor’s teaching approach and related courses." /><div className="instructors-filters"><label className="instructors-search"><Search size={18} aria-hidden="true" /><span className="accessible-only">Search instructors</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search instructors" /></label><div className="instructors-select-wrap"><label htmlFor="expertise-filter">Filter by expertise</label><select id="expertise-filter" value={expertise} onChange={event => setExpertise(event.target.value)}>{expertiseOptions.map(item => <option key={item}>{item}</option>)}</select></div></div>{filteredMentors.length ? <div className="instructors-grid">{filteredMentors.map((mentor, index) => <PageReveal key={mentor.name} className="instructor-directory-card" delay={index * 0.06}><a href={`/instructors/${mentorSlug(mentor.name)}`}><div className="instructor-directory-image"><img src={asset(mentor.image)} alt={mentor.name} loading="lazy" /><span>View profile <ArrowRight size={17} /></span></div><div className="instructor-directory-copy"><div><h3>{mentor.name}</h3><p>{mentor.role}</p></div><span className="instructor-expertise">{mentor.expertise}</span></div></a></PageReveal>)}</div> : <EmptyState title="No instructors found" description="Try a different name or expertise." action={<button className="button outline" type="button" onClick={() => { setQuery(''); setExpertise('All expertise'); }}>Clear filters</button>} />}</div></section>
      <BottomCta title="Learn alongside people who care." text="Start with a course, then keep your questions close." href="/courses" label="Explore courses" />
    </div>
  );
}

export function InstructorDetailPage({ mentor }: { mentor: Mentor }) {
  const relatedCourses = courses.filter(course => course.category === mentor.expertise);
  return (
    <div className="community-page instructor-detail-page">
      <PageHero eyebrow="Instructor profile" title={mentor.name} description={mentor.role} compact><div className="instructor-detail-hero-link"><a href="/instructors">← Back to all instructors</a></div></PageHero>
      <section className="content-section instructor-detail-intro"><div className="inner instructor-detail-intro-grid"><PageReveal className="instructor-detail-portrait"><img src={asset(mentor.image)} alt={mentor.name} /></PageReveal><PageReveal className="instructor-detail-bio"><p className="eyebrow">{mentor.expertise}</p><h2>A thoughtful guide for your next skill.</h2><p>{mentor.bio}</p><div className="instructor-detail-contact"><span>Have a question about learning with {mentor.name.split(' ')[0]}?</span><a className="button outline" href="/contact"><Mail size={17} />Contact Knowlect</a></div></PageReveal></div></section>
      <section className="content-section instructor-detail-approach"><div className="inner instructor-detail-approach-grid"><SectionIntro eyebrow="TEACHING APPROACH" title="Clear ideas, useful practice, honest feedback." description="The best learning relationship gives you enough structure to keep going and enough room to make the work your own." /><div className="approach-notes"><div><span>01</span><h3>Start with the why</h3><p>Understand the thinking behind a tool or technique before putting it into practice.</p></div><div><span>02</span><h3>Make it tangible</h3><p>Turn concepts into exercises and projects that make progress visible.</p></div><div><span>03</span><h3>Keep refining</h3><p>Use feedback as a practical next step, not a final judgment.</p></div></div></div></section>
      <section className="content-section instructor-detail-courses"><div className="inner"><SectionIntro eyebrow="RELATED COURSES" title={`Learn ${mentor.expertise} with Knowlect.`} description="Explore the course or courses connected to this mentor’s area of expertise." />{relatedCourses.length ? <div className="instructor-course-list">{relatedCourses.map(course => <PageReveal key={course.id} className="instructor-course-card"><a href={`/courses/${course.id}`}><img src={asset(course.image)} alt="" loading="lazy" /><div><p className="eyebrow">{course.category}</p><h3>{course.title}</h3><p>{course.description}</p><span className="instructor-course-meta"><span><BookOpen size={16} />{course.lessons} lessons</span><span><Clock3 size={16} />{course.duration}</span><strong>Explore <ArrowRight size={16} /></strong></span></div></a></PageReveal>)}</div> : <EmptyState title="More courses are on the way" description="Check back soon for courses connected to this mentor’s expertise." />}</div></section>
      <BottomCta title="Ready to learn with intention?" text="Take one practical step toward the skill you want to build." href="/courses" label="Explore all courses" />
    </div>
  );
}

export default AboutPage;
