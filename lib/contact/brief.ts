import { engagements } from '@/data/profile';

export type ProjectBriefInput = {
  name: string;
  email: string;
  service: string;
  summary: string;
};

const serviceLabels = new Map(engagements.map((engagement) => [engagement.id, engagement.title]));

export function buildProjectBrief(input: ProjectBriefInput) {
  const service = serviceLabels.get(input.service) ?? 'Not selected';

  return [
    'PROJECT BRIEF',
    '',
    `Name: ${input.name.trim()}`,
    `Reply email: ${input.email.trim()}`,
    `Service: ${service}`,
    '',
    'System / decision to discuss:',
    input.summary.trim(),
  ].join('\n');
}

export function buildMailtoHref(recipient: string, input: ProjectBriefInput) {
  const subject = `Project brief from ${input.name.trim()}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildProjectBrief(input))}`;
}
