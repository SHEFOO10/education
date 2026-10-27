# Knowlect

A responsive, multi-page recreation of the supplied Knowlect online-learning landing page, built with React, TypeScript, Vite, Framer Motion, and source components from ReactBits.

The landing page uses the original user-supplied screenshot artwork. Course, learner story, instructor, FAQ, and learning-journal content is included in the local source. Public routes are prerendered into content-bearing HTML during `pnpm build`; nested paths have their own generated `index.html` pages for direct access.

## Routes

- `/` — original landing page
- `/courses` and `/courses/:courseSlug` — searchable catalog and course detail pages
- `/about`, `/testimonials`, `/instructors`, and `/instructors/:mentorSlug`
- `/blog` and `/blog/:articleSlug`
- `/contact`, `/faq`, `/privacy`, and `/terms`
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

Course saves and newsletter form values are stored in the visitor's local browser only. There is no account, enrollment, payment, contact-message, newsletter-delivery, or course-playback backend connected to this static demonstration.

ReactBits CountUp and LogoLoop source is copied under `src/components/reactbits/`; its upstream attribution and license are preserved in that folder. Project text and image assets are provided in this repository.
