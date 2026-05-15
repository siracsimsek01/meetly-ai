export type SummarySection = {
  heading: string;
  bullets: string[];
};

export type GeneratedSummary = {
  tldr: string;
  sections: SummarySection[];
  decisions: string[];
  actionItems: { owner: string; task: string }[];
};

const VERBS = ['shipped', 'reviewed', 'aligned on', 'unblocked', 'scoped', 'flagged'];
const AREAS = [
  'the onboarding flow',
  'the pricing page',
  'the dashboard skeleton',
  'the AI assistant beta',
  'the recording pipeline',
  'the calendar redesign',
];
const PEOPLE = [
  'Sara Lin',
  'Marcus Hale',
  'Ava Park',
  'Jonas Reed',
  'Mei Tanaka',
  'Theo Bennet',
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const sentence = (): string =>
  `${pick(PEOPLE)} ${pick(VERBS)} ${pick(AREAS)}.`;

export const generateMockSummary = (title: string): GeneratedSummary => ({
  tldr: `In the "${title}" session, the team focused on shipping value early — we narrowed scope, surfaced two risks, and walked away with a clear set of follow-ups.`,
  sections: [
    {
      heading: 'Highlights',
      bullets: [sentence(), sentence(), sentence()],
    },
    {
      heading: 'Risks & open questions',
      bullets: [
        'Latency on the recordings strip needs a smaller payload before launch.',
        'Calendar permissions in the workspace switcher are still ambiguous.',
      ],
    },
  ],
  decisions: [
    'Ship the dashboard behind a feature flag for the next 5 days.',
    'Defer the whiteboard collab feature until Q3.',
  ],
  actionItems: [
    { owner: pick(PEOPLE), task: 'Draft the rollout plan for the new dashboard.' },
    { owner: pick(PEOPLE), task: 'Audit the recordings player for accessibility.' },
    { owner: pick(PEOPLE), task: 'Spec the AI assistant rate limits.' },
  ],
});

export const renderSummaryMarkdown = (
  title: string,
  s: GeneratedSummary,
): string => {
  const lines: string[] = [];
  lines.push(`# ${title} — Summary`, '');
  lines.push(`> ${s.tldr}`, '');
  for (const sec of s.sections) {
    lines.push(`## ${sec.heading}`);
    for (const b of sec.bullets) lines.push(`- ${b}`);
    lines.push('');
  }
  lines.push('## Decisions');
  for (const d of s.decisions) lines.push(`- ${d}`);
  lines.push('');
  lines.push('## Action items');
  for (const a of s.actionItems) lines.push(`- **${a.owner}** — ${a.task}`);
  return lines.join('\n');
};
