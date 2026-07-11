import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KashdaLogo from './KashdaLogo';

// next/image pulls in the Next runtime; stub it with a plain <img> for jsdom.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height } = props as {
      src: string;
      alt: string;
      width?: number;
      height?: number;
    };
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

describe('KashdaLogo', () => {
  it('renders the brand logo with accessible alt text', () => {
    render(<KashdaLogo />);
    const logo = screen.getByAltText('KASHDA');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/kashda_logo.svg');
  });

  it('applies custom dimensions', () => {
    render(<KashdaLogo width={200} height={60} />);
    const logo = screen.getByAltText('KASHDA');
    expect(logo).toHaveAttribute('width', '200');
    expect(logo).toHaveAttribute('height', '60');
  });
});
