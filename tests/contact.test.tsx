import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { buildMailtoHref, buildProjectBrief, getContactAvailabilityCopy } from '@/lib/contact/brief';

const validBrief = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  service: 'architecture-audit',
  summary: 'We need to understand where our inference path is saturating.',
};
afterEach(() => vi.unstubAllGlobals());

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
  it('offers one send button without the temporary email link', async () => {
    const user = userEvent.setup();
    render(<ContactDialog />);
    await user.click(screen.getByRole('button', { name: /start a project brief/i }));
    expect(screen.queryByRole('link', { name: /write via email/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });
  it('shows validation errors before preparing a brief', async () => {
    const user = userEvent.setup();
    render(<ContactDialog triggerLabel="Start a project brief" />);

    await user.click(screen.getByRole('button', { name: 'Start a project brief' }));
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid reply email/i)).toBeInTheDocument();
    expect(screen.getByText(/describe the system or decision/i)).toBeInTheDocument();
  });

  it('confirms a message only after the server accepts it', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', async () => Response.json({ success: true }));
    render(<ContactDialog triggerLabel="Start a project brief" />);

    await user.click(screen.getByRole('button', { name: 'Start a project brief' }));
    await user.type(screen.getByLabelText(/your name/i), validBrief.name);
    await user.type(screen.getByLabelText(/reply email/i), validBrief.email);
    await user.type(screen.getByLabelText(/task summary/i), validBrief.summary);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Message sent.');
    expect(screen.getByLabelText(/task summary/i)).toHaveValue('');
  });

  it('traps keyboard focus inside the modal and restores it after Escape', async () => {
    const user = userEvent.setup();
    render(<ContactDialog triggerLabel="Start a project brief" />);
    const trigger = screen.getByRole('button', { name: 'Start a project brief' });

    await user.click(trigger);
    const close = screen.getByRole('button', { name: 'Close contact form' });
    close.focus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: /send message/i })).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
