import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, Check, CheckCircle2, Clock3, ShieldCheck, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Course } from '../../data';
import { enrollCourse, readLearningState } from '../../learning';
import { asset } from './PageShared';
import './registration-modal.css';

export function RegistrationModal({ course, onClose, onRegistered }: { course: Course; onClose: () => void; onRegistered: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const firstInput = useRef<HTMLInputElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = dialog.current;
    element?.showModal();
    try {
      const profile = readLearningState().profile;
      if (profile) { setName(profile.name); setEmail(profile.email); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to read browser storage.'); }
    firstInput.current?.focus();
    return () => { element?.close(); document.body.style.overflow = previousOverflow; opener?.focus(); };
  }, []);

  useEffect(() => { if (success) successHeading.current?.focus(); }, [success]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!consent) { setError('Please agree to save your registration on this device.'); return; }
    try { enrollCourse(course.id, { name, email }); setSuccess(true); onRegistered(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Registration could not be saved. Please try again.'); }
  }

  return (
    <dialog ref={dialog} className="registration-modal" aria-labelledby={success ? 'registration-success-title' : 'registration-title'} aria-describedby="registration-demo-note" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
      <button type="button" className="registration-close" onClick={onClose} aria-label="Close registration"><X size={21} /></button>
      <div className="registration-layout">
        <aside className="registration-summary">
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <img src={asset(course.image)} alt={`${course.title} course`} />
          <span className="registration-category">{course.category}</span>
          <h2>{course.title}</h2>
          <div className="registration-facts"><span><BookOpen size={16} />{course.lessons} lessons</span><span><Clock3 size={16} />{course.duration}</span></div>
          <ul>{course.topics.map(topic => <li key={topic}><Check size={16} /><span>{topic}</span></li>)}</ul>
          <div className="registration-price"><span>Listed course price</span><strong>${course.price}</strong></div>
          <div className="registration-price registration-demo-total"><span>Charged for this demo</span><strong>$0</strong></div>
          <p>Registration here is a demo. It does not purchase this course or grant access to paid course materials.</p>
        </aside>
        <motion.div className="registration-content" initial={{ opacity: 0.7 }} animate={{ opacity: 1 }}>
          {success ? <div className="registration-success">
            <span className="registration-success-icon"><CheckCircle2 size={33} /></span>
            <p className="eyebrow">ONE STEP CLOSER</p>
            <h2 id="registration-success-title" ref={successHeading} tabIndex={-1}>Your learning path is ready.</h2>
            <p><strong>{course.title}</strong> is in your dashboard. Tick off lessons as you practice, and return whenever you like. Any progress already saved is kept.</p>
            <a className="button primary" href={`/dashboard?course=${course.id}`}>Go to my dashboard <ArrowRight size={17} /></a>
            <button type="button" className="registration-text-link" onClick={onClose}>Keep exploring this course</button>
          </div> : <>
            <p className="eyebrow">COURSE REGISTRATION</p>
            <h2 id="registration-title">Make room<br />for your next skill.</h2>
            <p className="registration-intro">A few details to personalize your learning space.</p>
            <form onSubmit={submit} className="registration-form">
              <label htmlFor="registration-name">Your name<input ref={firstInput} id="registration-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={event => { setName(event.target.value); setError(''); }} placeholder="e.g. Alex Morgan" /></label>
              <label htmlFor="registration-email">Email address<input id="registration-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setError(''); }} placeholder="you@example.com" /></label>
              <label className="registration-consent" htmlFor="registration-consent"><input id="registration-consent" type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I agree to save my name, email and learning progress in this browser. This is not a secure account or a payment. <a href="/privacy">Privacy notice</a></span></label>
              {error && <p className="registration-error" role="alert">{error}</p>}
              <button type="submit" className="button primary">Register for the demo <ArrowRight size={17} /></button>
            </form>
          </>}
          <p id="registration-demo-note" className="registration-storage-note"><ShieldCheck size={17} /><span>Stored only on this device. No payment, email confirmation or authenticated account is created. Clearing browser data removes your profile and progress.</span></p>
        </motion.div>
      </div>
    </dialog>
  );
}
