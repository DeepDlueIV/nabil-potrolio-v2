import { engagements } from '@/data/profile';

export type ProjectBriefInput = {
  name: string;
  email: string;
  service: string;
  summary: string;
};

const serviceLabels = new Map(engagements.map((engagement) => [engagement.id, engagement.title]));

export function getContactAvailabilityCopy(email: string) {
  if (email.trim()) {
    return {
      mode: 'email' as const,
      callout: 'A verified email is configured. The form prepares an email draft for review; nothing is sent automatically.',
      dialog: 'This prepares an email draft for you to review and send. Nothing is transmitted automatically.',
    };
  }

  return {
    mode: 'copy' as const,
    callout: 'No verified public email is configured. The brief is copied locally and nothing is sent.',
    dialog: 'This prepares a portable brief. Until a verified recipient is configured, nothing leaves your browser.',
  };
}

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
