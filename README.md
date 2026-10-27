# Knowlect

A responsive, multi-page recreation of the supplied Knowlect online-learning landing page, built with React, TypeScript, Vite, Framer Motion, and source components from ReactBits.

The landing page uses the original user-supplied screenshot artwork. Course, learner story, instructor, FAQ, and learning-journal content is included in the local source. Public routes are prerendered into content-bearing HTML during `pnpm build`; nested paths have their own generated `index.html` pages for direct access.

## Routes

- `/` — original landing page
- `/courses` and `/courses/:courseSlug` — searchable catalog and course detail pages
- `/about`, `/testimonials`, `/instructors`, and `/instructors/:mentorSlug`
- `/blog` and `/blog/:articleSlug`
- `/contact`, `/faq`, `/privacy`, and `/terms`
- `/dashboard` — browser-local student registration, enrolled courses and manual lesson progress (noindex)
- `404.html` — static not-found document

## Local development

```sh
pnpm install
pnpm dev
```

## Production build

```sh
pnpm build
```

The generated static site is written to `dist/`. If a confirmed HTTPS public website origin is configured as `PUBLIC_SITE_ORIGIN`, the build also writes canonical and Open Graph URLs plus `sitemap.xml` and `robots.txt`. Without that setting, no guessed public URL is emitted.

Course details include a registration modal with name/email validation, explicit browser-local storage consent, course summary, success state and a dashboard link. Demo registration stores the learner profile and course enrollment in `knowlect-learning-v1`. The student dashboard shows actual locally registered courses and persistent self-reported lesson completion, plus saved courses. These are not authenticated accounts, paid purchases, verified course completion or certificates. No card details or passwords are collected.

Course saves, learner profiles, enrollments, progress, contact drafts and newsletter values stay only in the visitor’s browser; clearing site storage removes them, and they do not synchronize across devices. No payment, contact-message, newsletter-delivery, or course-playback backend is connected. Course enrollment is a local demo and does not grant paid course access.

ReactBits CountUp and LogoLoop source is copied under `src/components/reactbits/`; its upstream attribution and license are preserved in that folder. Project text and image assets are provided in this repository.

## Learning-state checks

Run `pnpm test:learning` to check registration validation, duplicate enrollment preservation, isolated course progress, undo/completion, browser refresh persistence, invalid data, blocked storage and SSR safety. The test uses an in-memory storage mock, not a real learner profile.
