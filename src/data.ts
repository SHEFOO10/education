export type Category = 'All Courses' | 'UI/UX Design' | 'Development' | 'Marketing' | 'Graphic Design';

export interface Course {
  id: string;
  title: string;
  category: Category;
  image: string;
  price: number;
  lessons: number;
  duration: string;
  description: string;
  topics: string[];
}

export const courses: Course[] = [
  {
    id: 'python', title: 'Python Programming', category: 'Development', image: 'course-python', price: 20, lessons: 25, duration: '3hr 20mn',
    description: 'Unlock your coding potential. Build a strong foundation in Python with practical lessons and hands-on projects designed for your first steps in development.',
    topics: ['Python fundamentals and variables', 'Functions, loops, and data structures', 'Build your first real-world project'],
  },
  {
    id: 'marketing', title: 'Digital Marketing', category: 'Marketing', image: 'course-marketing', price: 10, lessons: 15, duration: '2hr 30mn',
    description: 'Discover the essentials of digital strategy and growth. Learn how to connect with the right audience and turn creative ideas into meaningful campaigns.',
    topics: ['Build a digital marketing strategy', 'Content, social media, and audience growth', 'Measure campaign performance'],
  },
  {
    id: 'design', title: 'UI/UX Design', category: 'UI/UX Design', image: 'course-design', price: 50, lessons: 30, duration: '4hr 50mn',
    description: 'Craft thoughtful user experiences from the first sketch to a polished prototype. Learn the tools and design principles used by professional product designers.',
    topics: ['User research and design thinking', 'Wireframes and interactive prototypes', 'Create a portfolio-ready design project'],
  },
  {
    id: 'analytics', title: 'Graphic Design & Branding', category: 'Graphic Design', image: 'course-analytics', price: 25, lessons: 15, duration: '3hr 20mn',
    description: 'Make your ideas visible. Explore visual communication, data storytelling, and the foundations of memorable design and branding.',
    topics: ['Visual hierarchy and design principles', 'Brand identity and creative direction', 'Present your ideas with confidence'],
  },
];

export const steps = [
  { number: '01', title: 'Choose Your Course', image: 'journey-course', description: 'Browse courses and career pathways based on your interest from design to development and more.' },
  { number: '02', title: 'Get Mentor Guidance', image: 'journey-mentor', description: 'Connect with experienced instructors, ask questions, and receive feedback to improve your skills.' },
  { number: '03', title: 'Celebrate Your Progress', image: 'journey-certificate', description: 'Keep track of lesson checkmarks in your browser-only dashboard. Progress is self-reported; this demonstration does not issue certificates.' },
];

export const mentors = [
  { name: 'Ayaan Rahman', role: 'UX Designer at Knowlect', image: 'instructor-ayaan', expertise: 'UI/UX Design', bio: 'Ayaan helps aspiring designers turn curiosity into useful, people-centered digital experiences. His lessons focus on research, prototyping, and building creative confidence.' },
  { name: 'Kristin Watson', role: 'Graphic Designer at Knowlect', image: 'instructor-kristin', expertise: 'Graphic Design', bio: 'Kristin brings a thoughtful approach to visual communication and branding, sharing practical techniques for creating distinctive and meaningful design.' },
  { name: 'Floyd Miles', role: 'Graphic Designer at Knowlect', image: 'instructor-floyd', expertise: 'Graphic Design', bio: 'Floyd makes technical and creative concepts approachable through hands-on examples, clear explanations, and practical project feedback.' },
  { name: 'Sara Hossain', role: 'Digital Marketing Mentor at Knowlect', image: 'instructor-sara', expertise: 'Marketing', bio: 'Sara teaches the essentials of digital marketing with a focus on thoughtful strategy, engaging content, and sustainable audience growth.' },
];
export type Mentor = (typeof mentors)[number];

export const testimonials = [
  { name: 'Ayaan Rahman', role: 'UX Design Learner', avatar: 'avatar-ayaan', quote: 'The lessons are easy to follow and the projects helped me build real confidence. I now understand how to apply what I’ve learned to real-world design challenges.' },
  { name: 'Afsana Ahmed', role: 'Frontend Development Learner', image: 'story-afsana', quote: 'Learning at my own pace made all the difference. Every lesson gave me something practical to try, and the projects helped me take the next step in frontend development.' },
  { name: 'Nabil Hasan', role: 'Graphic Design Learner', avatar: 'avatar-nabil', quote: 'I loved the flexibility! I could learn at my own pace while managing school. The feedback I received made a huge difference in improving my design skills.' },
  { name: 'Zayan Chowdhury', role: 'Digital Marketing Learner', image: 'story-zayan', quote: 'The practical examples helped everything click. I came away with a clearer marketing strategy and the confidence to put my ideas into action.' },
];
export type Testimonial = (typeof testimonials)[number];

export const faqs = [
  { question: 'What Type Of Courses Do You Offer?', answer: 'We Offer Skill-Based Courses Including UI/UX Design, Web Development, Digital Marketing, Graphic Design, Freelancing, And Soft Skills Training.' },
  { question: 'Are The Courses Beginner-Friendly?', answer: 'Yes! Our courses are designed to be approachable for beginners. You can start with the fundamentals and build your skills step by step, with guidance from experienced instructors.' },
  { question: 'Does This Demonstration Issue A Certificate?', answer: 'No. The dashboard lets you check off lessons as self-reported progress, but this demonstration does not verify course completion or issue a certificate.' },
  { question: 'Do I Get Access To The Course Materials?', answer: 'No. Registration adds a course to the browser-local demo dashboard only. Course playback, purchased materials, and paid access are not connected.' },
  { question: 'Can I Learn At My Own Pace?', answer: 'Absolutely. Our self-paced lessons fit around your schedule. Pause, replay, and return to your course when it works best for you.' },
];
