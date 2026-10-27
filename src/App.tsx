import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Code2, Eye, EyeClosed, Grid2X2, Megaphone, Palette, Play, Star, PanelsTopLeft, X } from 'lucide-react';
import CountUp from './components/reactbits/CountUp';
import LogoLoop from './components/reactbits/LogoLoop';
import { courses, faqs, mentors, steps, testimonials, type Category, type Course, type Mentor, type Testimonial } from './data';
import { SiteFooter, SiteHeader, SiteLayout } from './components/site/SiteLayout';
import { getRouteMetadata, resolveRoute, normalizePath } from './routes';

const image = (name: string) => `/images/${name}.webp`;
const categories: { name: Category; icon: typeof Grid2X2 }[] = [
  { name: 'All Courses', icon: Grid2X2 },
  { name: 'UI/UX Design', icon: PanelsTopLeft },
  { name: 'Development', icon: Code2 },
  { name: 'Marketing', icon: Megaphone },
  { name: 'Graphic Design', icon: Palette },
];

type Modal = { kind: 'course'; course: Course } | { kind: 'mentor'; mentor: Mentor } | { kind: 'story'; story: Testimonial } | { kind: 'catalog' } | { kind: 'intro' } | { kind: 'policy'; title: string };

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function SectionHeading({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return <div className="section-heading"><p className="eyebrow">{label}</p><Reveal className="heading-content"><h2>{children}</h2>{action}</Reveal></div>;
}

function HomePage() {
  const [category, setCategory] = useState<Category>('All Courses');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modal, setModal] = useState<Modal | null>(null);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [reviewIndex, setReviewIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);

  const openModal = (value: Modal) => {
    setReturnFocus(document.activeElement as HTMLElement);
    setSaved(false);
    setModal(value);
  };

  useEffect(() => {
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKey); returnFocus?.focus(); };
  }, [modal, returnFocus]);

  const pickCategory = (value: Category) => {
    setCategory(value);
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };
  const filteredCourses = category === 'All Courses' ? courses : courses.filter(course => course.category === category);
  const orderedReviews = testimonials.map((_, index) => testimonials[(index + reviewIndex) % testimonials.length]);

  const saveCourse = (course: Course) => {
    try {
      const current = JSON.parse(localStorage.getItem('knowlect-saved-courses') || '[]') as string[];
      localStorage.setItem('knowlect-saved-courses', JSON.stringify([...new Set([...current, course.id])]));
      setSaved(true);
    } catch { setSaved(true); }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="page-shell" id="home">
        <section className="hero">
          <SiteHeader path="/" />

          <main id="main-content" className="hero-main inner">
            <div className="hero-copy">
              <Reveal><div className="learner-rating"><span className="avatar-stack"><img src={image('avatar-ayaan')} alt="" /><img src={image('story-afsana')} alt="" /><img src={image('avatar-nabil')} alt="" /></span><Star size={16} fill="#e6a42f" stroke="#e6a42f" /><span>5.0 (2K+ Happy Learners)</span></div></Reveal>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}>Unlock Skills<br />That Shape<br />Your Future</motion.h1>
              <Reveal delay={0.18}><p className="hero-description">Meet the platform for modern design education. master soft and technical skills taught by industry experts.</p></Reveal>
              <Reveal delay={0.25}><a href="/courses" className="button primary hero-cta">Get Started Now</a></Reveal>
            </div>
            <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
              <motion.img src={image('hero-collage')} alt="Students discovering new skills, with over two thousand courses available" width="567" height="531" animate={{ y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
              <button className="hero-play" aria-label="Discover how learning at Knowlect works" onClick={() => openModal({ kind: 'intro' })}><Play size={17} fill="currentColor" /></button>
            </motion.div>
          </main>
        </section>

        <div className="partner-strip" aria-label="Our learning partners">
          <LogoLoop logos={Array.from({ length: 5 }, (_, i) => ({ src: image(`partner-${i + 1}`), alt: `Logoipsum learning partner ${i + 1}` }))} speed={24} direction="left" logoHeight={32} gap={125} pauseOnHover ariaLabel="Our learning partners" />
        </div>

        <section className="courses-section inner" id="courses" aria-labelledby="courses-title">
          <div className="section-heading course-heading"><p className="eyebrow">MOST POPULAR</p><div><Reveal><h2 id="courses-title">Our Most<br />Popular Courses</h2></Reveal><div className="category-tabs" role="tablist" aria-label="Course categories">{categories.map(({ name, icon: Icon }) => <button key={name} role="tab" aria-selected={category === name} onClick={() => setCategory(name)} className={category === name ? 'category-tab selected' : 'category-tab'}><Icon size={19} strokeWidth={1.7} />{name}</button>)}</div></div></div>
          <motion.div layout className={`course-grid ${category !== 'All Courses' ? 'is-filtered' : ''}`}>
            <AnimatePresence mode="popLayout">{filteredCourses.map((course, index) => <motion.article layout key={course.id} className={`course-card course-${course.id}`} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }}>
              <a className="course-image" href={`/courses/${course.id}`} aria-label={`Explore ${course.title}`}><img src={image(course.image)} alt={`${course.title} course banner`} loading="eager" />{course.id !== 'python' && <span className="course-hover">START LEARNING <ArrowRight size={17} /></span>}</a>
              <div className="course-title-row"><a href={`/courses/${course.id}`}>{course.title}</a><span className="course-price"><strong>${course.price}</strong>/Person</span></div>
              <div className="course-meta"><span><Clock3 size={19} strokeWidth={1.3} />{course.lessons} Lesson</span><i /><span><BookOpen size={19} strokeWidth={1.3} />{course.duration}</span></div>
            </motion.article>)}</AnimatePresence>
          </motion.div>
          <div className="center-cta"><a href="/courses" className="button outline">See All Courses</a></div>
        </section>

        <section className="journey-section" id="about" aria-label="How it works"><div className="inner">
          <SectionHeading label="HOW IT WORK">From Beginner to<br />Skilled Step by Step</SectionHeading>
          <div className="journey-steps">{steps.map(step => <Reveal key={step.number} className="journey-step"><div className="step-copy"><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div><img src={image(step.image)} alt={step.title} loading="eager" width="895" height="385" /></Reveal>)}</div>
        </div></section>

        <section className="testimonials-section inner" id="testimonials" aria-label="Learner testimonials">
          <SectionHeading label="TESTIMONIAL" action={<a className="button outline" href="/testimonials">See All Reviews</a>}>Stories From our<br />Learning Journey</SectionHeading>
          <div className="review-window"><motion.div className="review-grid" key={reviewIndex} initial={{ opacity: 0.75, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>{orderedReviews.map(review => review.image ? <button key={review.name} className="review-video" onClick={() => openModal({ kind: 'story', story: review })} aria-label={`Read ${review.name}'s learning story`}><img src={image(review.image)} alt={`${review.name}, ${review.role}`} loading="eager" /><span className="accessible-only">Read the learning story</span></button> : <button key={review.name} className="review-text" onClick={() => openModal({ kind: 'story', story: review })}><div className="review-author"><img src={image(review.avatar!)} alt="" /><div><h3>{review.name}</h3><p>{review.role}</p></div></div><p className="review-quote">“{review.quote}”</p><span className="review-date">Feb 20, 2025</span></button>)}</motion.div></div>
          <div className="review-controls" aria-label="Testimonial carousel controls"><button onClick={() => setReviewIndex((reviewIndex + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonials"><ArrowLeft size={18} /></button><span aria-live="polite">{reviewIndex + 1} / {testimonials.length}</span><button onClick={() => setReviewIndex((reviewIndex + 1) % testimonials.length)} aria-label="Next testimonials"><ArrowRight size={18} /></button></div>
          <div className="statistics">{[{ value: 8, suffix: '+', title: 'Years Experience' }, { value: 92, suffix: '%', title: 'Student Satisfaction' }, { value: 250, suffix: '+', title: 'Expert Mentors' }, { value: 50, suffix: 'K+', title: 'Total Student' }].map(stat => <div className="stat" key={stat.title}><p><CountUp to={stat.value} from={0} duration={1.5} trigger="load" />{stat.suffix}</p><span>{stat.title}</span></div>)}</div>
        </section>

        <section className="mentors-section inner" id="instructors" aria-label="Expert instructors">
          <SectionHeading label="OUR MENTORS" action={<a className="button outline" href="/instructors">See All Mentor</a>}>Meet our Expert<br />Instructors</SectionHeading>
          <div className="mentor-grid" id="mentor-cards">{mentors.map((mentor, index) => <Reveal key={mentor.name} delay={index * 0.06}><a className="mentor-card" href={`/instructors/${mentor.name.toLowerCase().replace(/\s+/g, '-')}`}><div className="mentor-image"><img src={image(mentor.image)} alt={mentor.name} loading="eager" width="279" height="400" /><span>Meet {mentor.name.split(' ')[0]} <ArrowRight size={17} /></span></div><h3>{mentor.name}</h3><p>{mentor.role}</p></a></Reveal>)}</div>
        </section>

        <section className="faq-section inner" id="faq" aria-labelledby="faq-title">
          <div className="section-heading"><p className="eyebrow">FAQ</p><Reveal><h2 id="faq-title">Answers to Your Most Common<br className="desktop-break" /> Questions</h2></Reveal></div>
          <div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={faq.question}><span className="faq-number">(0{index + 1})</span><div className="faq-content"><h3><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`}>{faq.question}<span aria-hidden="true">{openFaq === index ? <Eye size={23} strokeWidth={1.3} /> : <EyeClosed size={23} strokeWidth={1.3} />}</span></button></h3><AnimatePresence initial={false}>{openFaq === index && <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}><p>{faq.answer}</p></motion.div>}</AnimatePresence></div></div>)}</div>
        </section>

        <SiteFooter />
      </div>

      <AnimatePresence>{modal && <motion.div className="modal-backdrop" onClick={() => setModal(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} onClick={event => event.stopPropagation()} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} transition={{ duration: 0.25 }}><button className="modal-close" onClick={() => setModal(null)} aria-label="Close dialog"><X size={22} /></button>
        {modal.kind === 'course' && <><img className="modal-course-image" src={image(modal.course.image)} alt="" /><p className="eyebrow">YOUR NEXT CHAPTER</p><h2 id="dialog-title">{modal.course.title}</h2><p>{modal.course.description}</p><div className="modal-meta"><span><BookOpen size={18} />{modal.course.lessons} lessons</span><span><Clock3 size={18} />{modal.course.duration}</span><strong>${modal.course.price} / person</strong></div><h3>What you’ll learn</h3><ul className="topic-list">{modal.course.topics.map(topic => <li key={topic}><Check size={17} />{topic}</li>)}</ul><button className="button primary" onClick={() => saveCourse(modal.course)} disabled={saved}>{saved ? <><Check size={17} /> Saved to your learning list</> : 'Save to My Learning List'}</button>{saved && <p className="small-note" role="status">Saved on this device. No payment has been taken.</p>}</>}
        {modal.kind === 'catalog' && <><p className="eyebrow">FIND YOUR NEXT SKILL</p><h2 id="dialog-title">Explore our courses</h2><p>Small steps. Real skills. Choose the course that’s right for you.</p><div className="catalog-list">{courses.map(course => <button key={course.id} onClick={() => openModal({ kind: 'course', course })}><img src={image(course.image)} alt="" /><span><strong>{course.title}</strong><small>{course.lessons} lessons · {course.duration}</small></span><b>${course.price}</b><ArrowRight size={19} /></button>)}</div></>}
        {modal.kind === 'mentor' && <><div className="mentor-dialog-head"><img src={image(modal.mentor.image)} alt={modal.mentor.name} /><div><p className="eyebrow">MEET YOUR MENTOR</p><h2 id="dialog-title">{modal.mentor.name}</h2><p>{modal.mentor.role}</p></div></div><p>{modal.mentor.bio}</p><button className="button primary" onClick={() => { pickCategory(modal.mentor.expertise as Category); setModal(null); }}>Explore their courses <ArrowRight size={17} /></button></>}
        {modal.kind === 'story' && <><p className="eyebrow">A REAL LEARNING JOURNEY</p><h2 id="dialog-title">Meet {modal.story.name.split(' ')[0]}</h2><p className="story-role">{modal.story.role}</p><blockquote>“{modal.story.quote}”</blockquote><p className="small-note">Learner story · Feb 20, 2025</p><button className="button primary" onClick={() => { setModal(null); pickCategory('All Courses'); }}>Start your own journey <ArrowRight size={17} /></button></>}
        {modal.kind === 'intro' && <><p className="eyebrow">A LITTLE CURIOSITY. A BIG FUTURE.</p><h2 id="dialog-title">Your next chapter<br />starts with a skill.</h2><p>Knowlect brings practical courses and experienced mentors together, so you can learn something meaningful at your own pace.</p><div className="intro-steps">{steps.map(step => <div key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></div>)}</div><button className="button primary" onClick={() => { setModal(null); pickCategory('All Courses'); }}>Find your first course <ArrowRight size={17} /></button></>}
        {modal.kind === 'policy' && <><p className="eyebrow">KNOWLECT</p><h2 id="dialog-title">{modal.title}</h2><p>This is an interactive recreation of the supplied Knowlect landing-page design. Course selections and newsletter preferences are stored only in your browser on this device.</p><p>No account, purchase, payment, or email delivery is connected. For questions, contact <a href="mailto:info@knowlect.com">info@knowlect.com</a>.</p></>}
      </motion.div></motion.div>}</AnimatePresence>
    </>
  );
}


export interface AppProps { initialPath?: string; }

export function App({ initialPath }: AppProps = {}) {
  const path = normalizePath(initialPath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'));
  useEffect(() => {
    const metadata = getRouteMetadata(path);
    document.title = metadata.title;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.append(description); }
    description.content = metadata.description;
  }, [path]);
  if (path === '/') return <HomePage />;
  const route = resolveRoute(path);
  return <SiteLayout path={path}><main id="page-content">{route.content}</main></SiteLayout>;
}

export default App;
