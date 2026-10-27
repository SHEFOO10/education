import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export const asset = (name: string) => `/images/${name}.webp`;

export function PageReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function PageHero({ eyebrow, title, description, children, compact = false }: { eyebrow: string; title: ReactNode; description?: string; children?: ReactNode; compact?: boolean }) {
  return <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`}><div className="inner"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={14} /><span>{eyebrow}</span></nav><PageReveal><p className="eyebrow">{eyebrow.toUpperCase()}</p><h1>{title}</h1>{description && <p className="page-hero-description">{description}</p>}{children}</PageReveal></div></section>;
}

export function SectionIntro({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: string; children?: ReactNode }) {
  return <div className="subpage-section-heading"><p className="eyebrow">{eyebrow}</p><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</div>;
}

export function BottomCta({ title = 'Your next chapter starts with a skill.', text = 'Find the course that meets your curiosity. Learn at your pace, with people who care about your progress.', href = '/courses', label = 'Explore our courses' }: { title?: string; text?: string; href?: string; label?: string }) {
  return <section className="bottom-cta inner"><PageReveal><p className="eyebrow">KEEP YOUR CURIOSITY GOING</p><h2>{title}</h2><p>{text}</p><a className="button primary" href={href}>{label}<ArrowRight size={17} /></a></PageReveal></section>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><h3>{title}</h3><p>{description}</p>{action}</div>;
}
