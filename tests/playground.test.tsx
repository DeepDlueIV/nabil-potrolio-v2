import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ArchitecturePlayground } from '../components/architecture/ArchitecturePlayground';

describe('ArchitecturePlayground', () => {
  it('changes the architecture, nodes, boundary, and explanation with the selected scenario', async () => {
    const user = userEvent.setup();
    render(<ArchitecturePlayground />);

    expect(screen.getByRole('button', { name: /inspect vector store/i })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Streaming Data Platform' }));
    expect(screen.getByText('Data platform boundary')).toBeVisible();
    expect(screen.getByRole('button', { name: /inspect kafka/i })).toBeVisible();
    expect(screen.queryByRole('button', { name: /inspect vector store/i })).not.toBeInTheDocument();
  });

  it('shows useful node context outside the diagram', async () => {
    const user = userEvent.setup();
    render(<ArchitecturePlayground />);

    await user.click(screen.getByRole('button', { name: /inspect vector store/i }));
    expect(screen.getByRole('status', { name: /selected architecture node/i })).toHaveTextContent(/searchable embeddings/i);
    expect(screen.getByText(/Qdrant · Milvus/)).toBeVisible();
  });

  it('runs a burst flow, reroutes around a paused worker, and resets deterministically', async () => {
    const user = userEvent.setup();
    render(<ArchitecturePlayground />);

    await user.click(screen.getByRole('button', { name: 'Burst' }));
    await user.click(screen.getByRole('button', { name: 'Send demo request' }));
    expect(screen.getByTestId('architecture-diagram')).toHaveAttribute('data-load', 'burst');
    await user.click(screen.getByRole('button', { name: /pause inference a/i }));
    expect(screen.getByRole('status', { name: /demo status/i })).toHaveTextContent(/rerouted through inference b/i);
    expect(screen.getByTestId('architecture-diagram')).toHaveAttribute('data-route', 'app>gateway>retrieval>vector-store>inference-b>app');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('button', { name: 'Normal' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status', { name: /demo status/i })).toHaveTextContent(/ready/i);
  });

  it('reports a queued request when the secure scenario single worker is paused', async () => {
    const user = userEvent.setup();
    render(<ArchitecturePlayground />);

    await user.click(screen.getByRole('tab', { name: 'Secure Enterprise AI' }));
    await user.click(screen.getByRole('button', { name: /pause private inference/i }));
    await user.click(screen.getByRole('button', { name: 'Test controlled request' }));
    expect(screen.getByRole('status', { name: /demo status/i })).toHaveTextContent(/queued until private inference is available/i);
  });

  it('supports keyboard scenario selection', async () => {
    const user = userEvent.setup();
    render(<ArchitecturePlayground />);

    screen.getByRole('tab', { name: 'Private LLM / RAG' }).focus();
    await user.keyboard('{ArrowRight}');
    const streaming = screen.getByRole('tab', { name: 'Streaming Data Platform' });
    expect(streaming).toHaveAttribute('aria-selected', 'true');
    expect(streaming).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const secure = screen.getByRole('tab', { name: 'Secure Enterprise AI' });
    expect(secure).toHaveAttribute('aria-selected', 'true');
    expect(secure).toHaveFocus();
  });
});
