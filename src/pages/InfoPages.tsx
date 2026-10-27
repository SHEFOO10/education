import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, Mail, MapPin, Send } from 'lucide-react';
import { faqs as faqData } from '../data';
import { articles, type JournalArticle } from '../journal';
import { asset, BottomCta, EmptyState, PageHero, PageReveal, SectionIntro } from '../components/site/PageShared';
import './info-pages.css';

const contactDraftKey = 'knowlect-contact-draft';

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const emptyContactForm: ContactForm = { name: '', email: '', message: '' };

function ArticleCard({ article, index }: { article: JournalArticle; index: number }) {
  return (
    <PageReveal className="info-article-card" delay={index * 0.06}>
      <a className="info-article-card-image" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
        <img src={asset(article.image)} alt="" loading={index > 0 ? 'lazy' : 'eager'} />
        <span>Read article <ArrowRight size={16} aria-hidden="true" /></span>
      </a>
      <div className="info-article-card-copy">
        <div className="info-article-meta"><span>{article.category}</span><span aria-hidden="true">·</span><span>{article.minutes}</span></div>
        <h3><a href={`/blog/${article.slug}`}>{article.title}</a></h3>
        <p>{article.excerpt}</p>
        <a className="info-text-link" href={`/blog/${article.slug}`}>Keep reading <ArrowRight size={15} aria-hidden="true" /></a>
      </div>
    </PageReveal>
  );
}

export function BlogPage() {
  return (
    <div className="info-page info-blog-page">
      <PageHero
        eyebrow="Knowlect journal"
        title={<>Ideas for the<br /><em>next useful step.</em></>}
        description="Short, practical notes about learning, mentorship, and the projects that help new skills become part of your everyday life."
      >
        <div className="info-hero-note"><span aria-hidden="true">03</span><p>thoughtful reads<br />for curious learners</p></div>
      </PageHero>

      <section className="info-content-section" id="main-content">
        <div className="inner">
          <SectionIntro
            eyebrow="FROM THE JOURNAL"
            title="Make room for a little more practice."
            description="Start with the idea that meets you where you are. Every article is written to be useful in one sitting and easy to return to later."
          />
          <div className="info-article-grid">
            {articles.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
          </div>
        </div>
      </section>

      <section className="info-journal-links info-content-section" aria-labelledby="journal-links-title">
        <div className="inner info-journal-links-grid">
          <PageReveal>
            <p className="eyebrow">KEEP EXPLORING</p>
            <h2 id="journal-links-title">A clear next step is often closer than it feels.</h2>
          </PageReveal>
          <PageReveal className="info-journal-link-list" delay={0.08}>
            <a href="/courses"><span>Find a course</span><ArrowRight size={18} aria-hidden="true" /></a>
            <a href="/faq"><span>Read common questions</span><ArrowRight size={18} aria-hidden="true" /></a>
            <a href="/contact"><span>Talk to Knowlect</span><ArrowRight size={18} aria-hidden="true" /></a>
          </PageReveal>
        </div>
      </section>
      <BottomCta title="Let one useful idea lead to another." text="Choose a course, revisit a note, or take a small project one step further." href="/courses" label="Explore our courses" />
    </div>
  );
}

function ArticleNotFound({ slug }: { slug: string }) {
  return (
    <div className="info-page info-article-page">
      <PageHero eyebrow="Journal" title="That article is not here." description={`We could not find a journal entry for “${slug}”. The rest of the journal is still open to explore.`} compact>
        <a className="info-back-link" href="/blog"><ArrowLeft size={16} aria-hidden="true" /> Back to the journal</a>
      </PageHero>
      <section className="info-content-section" id="main-content">
        <div className="inner"><EmptyState title="Try another place to begin" description="Browse the journal or choose a course for a practical next step." action={<div className="info-empty-actions"><a className="button primary" href="/blog">Browse journal</a><a className="button outline" href="/courses">Explore courses</a></div>} /></div>
      </section>
    </div>
  );
}

export function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find(candidate => candidate.slug === slug);
  if (!article) return <ArticleNotFound slug={slug} />;

  const relatedArticles = articles.filter(candidate => candidate.slug !== article.slug);
  return (
    <div className="info-page info-article-page">
      <PageHero eyebrow={article.category} title={article.title} description={article.excerpt} compact>
        <div className="info-article-hero-meta"><span><Clock3 size={16} aria-hidden="true" /> {article.minutes}</span><a className="info-back-link" href="/blog"><ArrowLeft size={16} aria-hidden="true" /> Back to the journal</a></div>
      </PageHero>

      <section className="info-content-section" id="main-content">
        <div className="inner info-article-layout">
          <article className="info-article-body">
            <PageReveal className="info-article-feature-image"><img src={asset(article.image)} alt="" /></PageReveal>
            <PageReveal className="info-article-prose" delay={0.05}>
              <p className="info-article-lede">A small, considered shift can make learning feel more possible. Here is one way to think about {article.title.toLowerCase()}.</p>
              {article.sections.map(section => (
                <section key={section.heading} aria-labelledby={`${article.slug}-${section.heading.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}>
                  <h2 id={`${article.slug}-${section.heading.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}>{section.heading}</h2>
                  {section.text.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </PageReveal>
          </article>

          <aside className="info-article-aside" aria-label="Article details">
            <div className="info-article-aside-card">
              <p className="eyebrow">A NOTE TO KEEP</p>
              <p>Learning does not need a dramatic reset. One clear next step is enough to begin.</p>
              <a className="info-text-link" href="/courses">Find your next course <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </aside>
        </div>
      </section>

      <section className="info-related-section info-content-section" aria-labelledby="related-articles-title">
        <div className="inner">
          <SectionIntro eyebrow="MORE FROM THE JOURNAL" title={<span id="related-articles-title">Keep the thread going.</span>} description="Another short read may offer a useful way to look at your next session." />
          <div className="info-related-grid">{relatedArticles.map((related, index) => <ArticleCard key={related.slug} article={related} index={index} />)}</div>
        </div>
      </section>
      <BottomCta title="Take the next small step." text="Keep the idea close with a course designed for useful practice." href="/courses" label="Explore courses" />
    </div>
  );
}

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>(emptyContactForm);
  const [submitted, setSubmitted] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(contactDraftKey) || 'null') as Partial<ContactForm> | null;
      if (saved) setForm({ ...emptyContactForm, ...saved });
    } catch {
      // A missing or unreadable browser draft should never block the form.
    }
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    try {
      window.localStorage.setItem(contactDraftKey, JSON.stringify(form));
    } catch {
      // Local storage is optional for this demo form.
    }
  }, [draftReady, form]);

  const updateField = (field: keyof ContactForm, value: string) => {
    setSubmitted(false);
    setForm(current => ({ ...current, [field]: value }));
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="info-page info-contact-page">
      <PageHero eyebrow="Contact Knowlect" title={<>Bring your<br /><em>question along.</em></>} description="Whether you are choosing a first course or finding your way back to practice, we are glad to hear what is on your mind." />
      <section className="info-content-section" id="main-content">
        <div className="inner info-contact-layout">
          <PageReveal className="info-contact-intro">
            <SectionIntro eyebrow="SAY HELLO" title="A thoughtful answer starts with a little context." description="Use the form for this local demo, or email us directly if you would like to continue the conversation outside the page." />
            <div className="info-contact-details">
              <a href="mailto:info@knowlect.com"><Mail size={18} aria-hidden="true" /><span><small>Email</small>info@knowlect.com</span></a>
              <div><MapPin size={18} aria-hidden="true" /><span><small>Location</small>Online learning community</span></div>
            </div>
          </PageReveal>

          <PageReveal className="info-contact-form-wrap" delay={0.08}>
            <form className="info-contact-form" onSubmit={submitForm}>
              <div className="info-form-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" type="text" value={form.name} onChange={event => updateField('name', event.target.value)} required autoComplete="name" /></div>
              <div className="info-form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" value={form.email} onChange={event => updateField('email', event.target.value)} required autoComplete="email" /></div>
              <div className="info-form-field"><label htmlFor="contact-message">How can we help?</label><textarea id="contact-message" name="message" value={form.message} onChange={event => updateField('message', event.target.value)} required rows={6} /></div>
              <button className="button primary" type="submit">Save this message <Send size={16} aria-hidden="true" /></button>
              <p className="info-form-note">This form is a local demo. Your draft is saved only in this browser until you clear it.</p>
              {submitted && <p className="info-form-status" role="status"><Check size={17} aria-hidden="true" /> This is a local demo: no message was transmitted. <a href="mailto:info@knowlect.com">Email info@knowlect.com instead.</a></p>}
            </form>
          </PageReveal>
        </div>
      </section>
      <BottomCta title="Prefer a direct note?" text="Email info@knowlect.com and keep the conversation simple." href="mailto:info@knowlect.com" label="Email Knowlect" />
    </div>
  );
}

export function FaqPage({ faqs = faqData }: { faqs?: typeof faqData } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="info-page info-faq-page">
      <PageHero eyebrow="Frequently asked questions" title={<>Good questions make<br /><em>better beginnings.</em></>} description="A few clear answers about the way Knowlect courses, practice, and this demonstration site work." />
      <section className="info-content-section" id="main-content">
        <div className="inner">
          <SectionIntro eyebrow="THE SHORT VERSION" title="Start with what you need to know." description="Open a question to read the full answer. If yours is not here, send a note through the contact page." />
          <div className="info-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `info-faq-answer-${index}`;
              const questionId = `info-faq-question-${index}`;
              return (
                <div className={isOpen ? 'info-faq-item is-open' : 'info-faq-item'} key={faq.question}>
                  <span className="info-faq-number">0{index + 1}</span>
                  <div className="info-faq-content">
                    <h2><button id={questionId} type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenIndex(isOpen ? null : index)}>{faq.question}<ChevronDown size={21} aria-hidden="true" /></button></h2>
                    <div id={answerId} role="region" aria-labelledby={questionId} hidden={!isOpen}><p>{faq.answer}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <BottomCta title="Still wondering about your next step?" text="We can help you find a course that feels practical and possible." href="/contact" label="Contact Knowlect" />
    </div>
  );
}

type LegalKind = 'privacy' | 'terms';

const legalCopy: Record<LegalKind, { eyebrow: string; title: string; description: string; sections: { heading: string; paragraphs: string[] }[] }> = {
  privacy: {
    eyebrow: 'Demo policy page',
    title: 'Privacy, kept clear.',
    description: 'This demonstration privacy page explains what the current Knowlect interface does and does not connect to.',
    sections: [
      { heading: 'What this demo stores', paragraphs: ['The interface may save limited preferences in your browser, such as a course saved to a learning list, a newsletter email entered in the footer, or a contact-form draft. These values stay in local browser storage for this demonstration.', 'No server-side account, learner profile, payment record, course delivery system, newsletter delivery, or message delivery is connected to these pages.'] },
      { heading: 'What is not connected', paragraphs: ['There is no sign-in, checkout, payment processing, enrollment, course progress service, newsletter system, or customer-message inbox behind this demo. Submitting the contact form does not transmit a message.', 'If you choose to email info@knowlect.com, your email app and email provider handle that message outside this demonstration site.'] },
      { heading: 'Your browser choices', paragraphs: ['You can clear the saved values for this demo through your browser’s site-data controls. Clearing them may remove saved course or form preferences from this device.', 'This page is not a notice for an operating business or a substitute for a production privacy program. It describes the current demonstration behavior honestly and narrowly.'] },
    ],
  },
  terms: {
    eyebrow: 'Demo policy page',
    title: 'Terms, without the fine print theater.',
    description: 'This demonstration terms page describes the limited purpose of the Knowlect interface as it exists today.',
    sections: [
      { heading: 'A demonstration experience', paragraphs: ['Knowlect pages are presented as a content and interface demonstration. They are not connected to an operating course marketplace, account system, payment service, or course-delivery platform.', 'Course prices, descriptions, certificates, mentor profiles, and calls to action are illustrative content for the experience. No purchase, enrollment, or certificate is created through these pages.'] },
      { heading: 'Local interactions only', paragraphs: ['Saving a course, entering a newsletter email, or keeping a contact draft affects only local browser storage when that feature is available. The contact form does not send or deliver messages.', 'For a real conversation, use your own email application to contact info@knowlect.com. That communication is outside the behavior of this demonstration.'] },
      { heading: 'Use of this page', paragraphs: ['Please treat the content as informational interface copy rather than a contract for an operating service. No paid service, account benefit, access promise, or delivery commitment is created by visiting or interacting with this demo.', 'This is a demo policy page, written to avoid making claims about services that are not connected.'] },
    ],
  },
};

export function LegalPage({ kind }: { kind: LegalKind }) {
  const content = legalCopy[kind];
  return (
    <div className="info-page info-legal-page">
      <PageHero eyebrow={content.eyebrow} title={content.title} description={content.description} compact>
        <div className="info-policy-badge">This is a demonstration policy, not an operating-business notice.</div>
      </PageHero>
      <section className="info-content-section" id="main-content">
        <div className="inner info-legal-layout">
          <aside className="info-legal-aside"><p className="eyebrow">KNOWLECT</p><p>Clear language for a site that is intentionally still a demonstration.</p><nav aria-label="Policy pages"><a className={kind === 'privacy' ? 'is-current' : ''} href="/privacy">Privacy policy <ArrowRight size={15} aria-hidden="true" /></a><a className={kind === 'terms' ? 'is-current' : ''} href="/terms">Terms &amp; conditions <ArrowRight size={15} aria-hidden="true" /></a></nav></aside>
          <article className="info-legal-prose">
            {content.sections.map((section, index) => <PageReveal key={section.heading} className="info-legal-section" delay={index * 0.05}><p className="eyebrow">0{index + 1}</p><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</PageReveal>)}
            <div className="info-legal-callout"><strong>In short:</strong> this page documents a front-end demonstration. No payment, accounts, course delivery, newsletters, or message delivery are connected.</div>
          </article>
        </div>
      </section>
      <BottomCta title="Have a question about the demo?" text="Reach out directly, or return to the learning experience." href="/contact" label="Contact Knowlect" />
    </div>
  );
}

export function NotFoundPage({ path }: { path: string }) {
  return (
    <div className="info-page info-not-found-page">
      <PageHero eyebrow="Page not found" title={<>A small detour<br /><em>is okay.</em></>} description={`There is no page at ${path || 'this address'} in the Knowlect demonstration.`} compact />
      <section className="info-content-section" id="main-content">
        <div className="inner"><EmptyState title="Let’s find a better starting point" description="Return home for the full experience or browse the course catalog when you are ready to keep moving." action={<div className="info-empty-actions"><a className="button primary" href="/">Go home</a><a className="button outline" href="/courses">Browse courses</a></div>} /></div>
      </section>
    </div>
  );
}
