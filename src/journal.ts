export interface JournalArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  minutes: string;
  sections: { heading: string; text: string[] }[];
}

export const articles: JournalArticle[] = [
  {
    slug: 'build-a-learning-habit', category: 'Learning', title: 'A little practice, a little more often.',
    excerpt: 'A thoughtful way to build a learning routine that fits around real life—without turning it into another full-time commitment.',
    image: 'journey-course', minutes: '4 min read',
    sections: [
      { heading: 'Choose a small, useful starting point', text: ['A new skill can feel enormous when you look at everything there is to know. Begin with something you can actually use: write a short Python script, sketch a simpler checkout screen, or outline a small marketing campaign.', 'The goal is not to make your first attempt impressive. It is to give your curiosity a concrete shape, so you have something to return to and improve.'] },
      { heading: 'Make the next session easy to begin', text: ['Before you stop practicing, leave yourself a short note. Write down what you tried, where you got stuck, and the smallest next step. A useful note can turn “I should study” into “I know where to begin.”', 'Keep your working files, lesson link, and notes together. Removing small practical obstacles makes it easier to use whatever time you have available.'] },
      { heading: 'Let the routine fit your life', text: ['Choose a pace you can repeat. A short session with a clear purpose is more useful than a long session that leaves you reluctant to come back. If you miss a day or a week, return to your notes and continue.', 'Progress does not have to follow a perfect calendar. It can be a series of useful, ordinary sessions that gradually give you more confidence.'] },
    ],
  },
  {
    slug: 'make-mentor-feedback-useful', category: 'Mentorship', title: 'Ask better questions. Make better progress.',
    excerpt: 'How to turn an uncertain first draft into a clear conversation with a mentor, and leave with a practical next step.',
    image: 'journey-mentor', minutes: '3 min read',
    sections: [
      { heading: 'Share the context, not just the result', text: ['When you ask for feedback, explain what you were trying to achieve and who the work is for. Show one or two decisions you made along the way. A mentor can offer more useful guidance when the reasoning is visible.', 'You do not need to defend every choice. Treat the explanation as an invitation to think together about what could work better.'] },
      { heading: 'Ask one focused question', text: ['“Is this good?” is difficult to answer usefully. Try “Is the first step clear to a new user?” or “What would you simplify in this function?” A focused question gives the conversation a direction.', 'If several things need attention, choose the one that matters most to the goal of the project. You can return to the others after making that first improvement.'] },
      { heading: 'Turn the answer into an experiment', text: ['Write down the suggestion in your own words, then try it. Compare the new version with the old one and note what changed. Feedback becomes a skill when you can see how a decision affects the work.', 'Keep the conversation open. A thoughtful follow-up can show what you learned and help identify the next useful step.'] },
    ],
  },
  {
    slug: 'first-portfolio-project', category: 'Career & Practice', title: 'Your first project deserves a place in your portfolio.',
    excerpt: 'You do not need a perfect project to tell a useful story. Start with a clear problem, show your decisions, and explain what you learned.',
    image: 'journey-certificate', minutes: '4 min read',
    sections: [
      { heading: 'Begin with a problem you can explain', text: ['Choose a project small enough to finish and specific enough to talk about clearly. A familiar task, a local community need, or a workflow you use yourself can be a useful starting point.', 'Describe what the project is meant to do and what a successful outcome would look like. Keep this description close as you make decisions.'] },
      { heading: 'Keep traces of the thinking', text: ['Save a few early sketches, notes, or working versions. These do not need to be polished. They help you explain how the idea changed and why you chose one direction over another.', 'A portfolio is not only a gallery of final images. It can also show how you approach a problem, respond to feedback, and make trade-offs.'] },
      { heading: 'Finish with an honest reflection', text: ['Explain what you made, what you learned, and what you would try next. If you did not test an idea or measure an outcome, say so rather than inventing a result.', 'A clear, thoughtful account of a modest project can communicate more than a polished presentation with no reasoning behind it.'] },
    ],
  },
];
