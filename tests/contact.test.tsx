import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { buildMailtoHref, buildProjectBrief, getContactAvailabilityCopy } from '@/lib/contact/brief';

const validBrief = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  service: 'architecture-audit',
  summary: 'We need to understand where our inference path is saturating.',
};

describe('project brief', () => {
  it('builds a portable, explicit text brief', () => {
    expect(buildProjectBrief(validBrief)).toContain('Name: Ada Lovelace');
    expect(buildProjectBrief(validBrief)).toContain('Reply email: ada@example.com');
    expect(buildProjectBrief(validBrief)).toContain('Service: High-Load Architecture Audit & Cost Redesign');
    expect(buildProjectBrief(validBrief)).toContain(validBrief.summary);
  });

  it('builds a configured email draft without claiming a send', () => {
    const href = buildMailtoHref('verified@example.com', validBrief);

    expect(href).toMatch(/^mailto:verified@example\.com\?/);
    expect(decodeURIComponent(href)).toContain('Project brief from Ada Lovelace');
    expect(decodeURIComponent(href)).toContain(validBrief.summary);
  });

  it('keeps contact availability copy consistent with configuration', () => {
    expect(getContactAvailabilityCopy('')).toMatchObject({ mode: 'copy' });
    expect(getContactAvailabilityCopy('').callout).toMatch(/No verified public email/i);
    expect(getContactAvailabilityCopy('verified@example.com')).toMatchObject({ mode: 'email' });
    expect(getContactAvailabilityCopy('verified@example.com').callout).toMatch(/verified email/i);
  });
});

describe('contact dialog', () => {
  it('offers a temporary email draft with the entered brief', async () => {
    const user = userEvent.setup();
    render(<ContactDialog />);
    await user.click(screen.getByRole('button', { name: /start a project brief/i }));
    await user.type(screen.getByLabelText(/your name/i), validBrief.name);
    await user.type(screen.getByLabelText(/task summary/i), validBrief.summary);
    const href = screen.getByRole('link', { name: /write via email/i }).getAttribute('href')!;
    expect(href).toMatch(/^mailto:nabil\.rakdani@codehaus\.pro\?/);
    expect(decodeURIComponent(href)).toContain(validBrief.summary);
  });
  it('shows validation errors before preparing a brief', async () => {
    const user = userEvent.setup();
    render(<ContactDialog triggerLabel="Start a project brief" />);

    await user.click(screen.getByRole('button', { name: 'Start a project brief' }));
    await user.click(screen.getByRole('button', { name: /prepare brief/i }));

    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid reply email/i)).toBeInTheDocument();
    expect(screen.getByText(/describe the system or decision/i)).toBeInTheDocument();
  });

  it('copies a brief locally when no verified recipient is configured', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<ContactDialog triggerLabel="Start a project brief" />);

    await user.click(screen.getByRole('button', { name: 'Start a project brief' }));
    await user.type(screen.getByLabelText(/your name/i), validBrief.name);
    await user.type(screen.getByLabelText(/reply email/i), validBrief.email);
    await user.type(screen.getByLabelText(/task summary/i), validBrief.summary);
    await user.click(screen.getByRole('button', { name: /prepare brief/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Brief copied. Nothing was sent.');
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining(validBrief.summary));
  });

  it('traps keyboard focus inside the modal and restores it after Escape', async () => {
    const user = userEvent.setup();
    render(<ContactDialog triggerLabel="Start a project brief" />);
    const trigger = screen.getByRole('button', { name: 'Start a project brief' });

    await user.click(trigger);
    const close = screen.getByRole('button', { name: 'Close contact form' });
    close.focus();
    await user.tab({ shift: true });
    expect(screen.getByRole('link', { name: /write via email/i })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
