import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Engagement } from '@/components/engagement/Engagement';
import { Experience } from '@/components/experience/Experience';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { About } from '@/components/about/About';
import { ContactLinks } from '@/components/contact/ContactLinks';

describe('open professional content', () => {
  it('keeps all four roles and their full evidence visible without disclosure', () => {
    render(<Experience />);
    const record = screen.getByRole('region', { name: 'Career chronology' });
    expect(record).toHaveTextContent('2019 — 2020');
    expect(record).toHaveTextContent('Developed execution modules, low-latency data connectors');
    expect(record).toHaveTextContent('C++ · Go · Redis · PostgreSQL');
    expect(within(record).getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(record.closest('details')).toBeNull();
  });

  it('holds a manually selected experience frame until explicit continuation', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    await user.click(screen.getByRole('button', { name: 'Show experience frame 4' }));
    expect(screen.getByRole('button', { name: 'Continue presentation' })).toBeInTheDocument();
  });

  it('makes every tool purpose and standards context available without view-all', () => {
    render(<TechnologyExplorer />);
    const inventory = screen.getByRole('region', { name: 'Complete technology stack' });
    expect(inventory).toHaveTextContent('ISO 27001');
    expect(inventory).toHaveTextContent('TensorRT-LLM');
    expect(inventory).toHaveTextContent('Hetzner');
    expect(inventory).toHaveTextContent('Concurrent services and infrastructure tooling');
    expect(within(inventory).queryAllByRole('button')).toHaveLength(0);
    expect(inventory.closest('details')).toBeNull();
  });

  it('introduces Nabil with the supplied portrait and verified languages', () => {
    render(<About />);
    expect(screen.getByRole('img', { name: 'Nabil Rakdani beside a GPU rig' })).toBeInTheDocument();
    expect(screen.getByText(/My seven years of experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Italian — Native/)).toBeInTheDocument();
  });

  it('omits empty social contacts and enables the real GitHub URL from data', () => {
    const { rerender } = render(<ContactLinks contacts={{ email: '', github: '', linkedin: '' }} />);
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
    rerender(<ContactLinks contacts={{ email: '', github: 'https://github.com/example', linkedin: '' }} />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/example');
  });

  it('prefills the project brief from an engagement', async () => {
    const user = userEvent.setup();
    render(<Engagement />);
    await user.click(screen.getByRole('button', { name: /discuss fractional cto/i }));
    expect(screen.getByLabelText(/service/i)).toHaveValue('fractional-cto');
  });
});
