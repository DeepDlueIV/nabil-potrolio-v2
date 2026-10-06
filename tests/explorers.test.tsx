import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Engagement } from '@/components/engagement/Engagement';
import { Experience } from '@/components/experience/Experience';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { MotionControl, MotionProvider } from '@/components/ui/MotionProvider';

describe('portfolio explorers', () => {
  it('changes the active role, image, and evidence together', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    expect(screen.getByRole('heading', { name: /independent principal architect/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /server infrastructure/i })).toHaveAttribute(
      'src',
      expect.stringContaining('experience-datacenter'),
    );

    await user.click(screen.getByRole('tab', { name: /show full-stack systems engineer/i }));

    expect(screen.getByRole('heading', { name: 'Full-Stack Systems Engineer' })).toBeInTheDocument();
    expect(screen.getByText('2019 — 2020')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /electronic hardware/i })).toHaveAttribute(
      'src',
      expect.stringContaining('experience-hardware'),
    );
  });

  it('connects a selected technology to its architecture layer and can reveal the full stack', async () => {
    const user = userEvent.setup();
    render(<TechnologyExplorer />);

    expect(screen.getByRole('button', { name: 'CUDA' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/GPU compute and kernel execution/i)).toBeInTheDocument();
    expect(screen.getByText('Inference')).toHaveClass('is-active');

    await user.click(screen.getByRole('button', { name: 'Qdrant' }));
    expect(screen.getByText(/Vector retrieval for semantic context/i)).toBeInTheDocument();
    expect(screen.getByText('Retrieval')).toHaveClass('is-active');

    await user.click(screen.getByRole('button', { name: /view all technologies/i }));
    expect(screen.getByRole('button', { name: 'ISO 27001' })).toBeInTheDocument();
  });

  it('prefills the project brief from the selected engagement', async () => {
    const user = userEvent.setup();
    render(<Engagement />);

    await user.click(screen.getByRole('button', { name: /discuss fractional cto/i }));

    expect(screen.getByRole('dialog', { name: /start a conversation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toHaveValue('fractional-cto');
  });

  it('offers an explicit reduced-motion control', async () => {
    const user = userEvent.setup();
    render(
      <MotionProvider>
        <MotionControl />
      </MotionProvider>,
    );

    const control = screen.getByRole('button', { name: /reduce motion/i });
    expect(control).toHaveAttribute('aria-pressed', 'false');

    await user.click(control);
    expect(screen.getByRole('button', { name: /use full motion/i })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-motion', 'reduced');
  });
});
