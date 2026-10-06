import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Engagement } from '@/components/engagement/Engagement';
import { ArchitecturePlayground } from '@/components/architecture/ArchitecturePlayground';
import { Experience } from '@/components/experience/Experience';
import { Hero } from '@/components/hero/Hero';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { MotionControl, MotionProvider } from '@/components/ui/MotionProvider';

describe('portfolio explorers', () => {
  it('changes the active role, image, and evidence together', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    expect(within(screen.getByRole('tabpanel')).getByRole('heading', { name: /independent principal architect/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /server infrastructure/i })).toHaveAttribute(
      'src',
      expect.stringContaining('experience-datacenter'),
    );

    await user.click(screen.getByRole('tab', { name: /show full-stack systems engineer/i }));

    const rolePanel = within(screen.getByRole('tabpanel'));
    expect(rolePanel.getByRole('heading', { name: 'Full-Stack Systems Engineer' })).toBeInTheDocument();
    expect(rolePanel.getByText(/2019 — 2020/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /electronic hardware/i })).toHaveAttribute(
      'src',
      expect.stringContaining('experience-hardware'),
    );
  });

  it('moves experience tab selection and focus with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const principal = screen.getByRole('tab', { name: /show independent principal/i });

    principal.focus();
    await user.keyboard('{ArrowRight}');

    const lead = screen.getByRole('tab', { name: /show lead solutions architect/i });
    expect(lead).toHaveFocus();
    expect(lead).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the complete role record available without client interaction', () => {
    render(<Experience />);

    const record = screen.getByRole('group', { name: 'Complete experience record' });
    expect(record).toHaveTextContent('2019 — 2020');
    expect(record).toHaveTextContent('Developed execution modules, low-latency data connectors');
    expect(record).toHaveTextContent('C++ · Go · Redis · PostgreSQL');
  });

  it('connects a selected technology to its architecture layer and can reveal the full stack', async () => {
    const user = userEvent.setup();
    render(<TechnologyExplorer />);

    expect(screen.getByRole('button', { name: 'CUDA' })).toHaveAttribute('aria-pressed', 'true');
    const inspector = within(screen.getByRole('complementary'));
    expect(inspector.getByText(/GPU compute and kernel execution/i)).toBeInTheDocument();
    expect(inspector.getByText('Inference')).toHaveClass('is-active');

    await user.click(screen.getByRole('button', { name: 'Qdrant' }));
    expect(inspector.getByText(/Vector retrieval for semantic context/i)).toBeInTheDocument();
    expect(inspector.getByText('Retrieval')).toHaveClass('is-active');

    await user.click(screen.getByRole('button', { name: /view all technologies/i }));
    expect(screen.getByRole('button', { name: 'ISO 27001' })).toBeInTheDocument();
  });

  it('keeps the complete technology inventory in server-rendered markup', () => {
    render(<TechnologyExplorer />);

    const inventory = screen.getByRole('group', { name: 'Complete technology inventory' });
    expect(inventory).toHaveTextContent('ISO 27001');
    expect(inventory).toHaveTextContent('TensorRT-LLM');
    expect(inventory).toHaveTextContent('Hetzner');
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
        <Hero forceFallback />
        <ArchitecturePlayground />
      </MotionProvider>,
    );

    const control = screen.getByRole('button', { name: /reduce motion/i });
    expect(control).toHaveAttribute('aria-pressed', 'false');

    await user.click(control);
    expect(screen.getByRole('button', { name: /use full motion/i })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-motion', 'reduced');
    expect(screen.getByTestId('compute-scene')).toHaveAttribute('data-paused', 'true');
    expect(screen.getByRole('button', { name: /motion reduced globally/i })).toBeDisabled();
    expect(screen.getByTestId('architecture-workbench')).toHaveAttribute('data-motion', 'reduced');
  });
});
