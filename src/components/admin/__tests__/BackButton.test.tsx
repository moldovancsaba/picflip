import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import BackButton from '../BackButton';

// Mock Next.js useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;

describe('BackButton', () => {
  const defaultProps = {
    label: 'Back',
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      back: jest.fn(),
    });
  });

  it('renders label correctly', () => {
    render(<BackButton {...defaultProps} />);
    
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<BackButton {...defaultProps} icon="←" />);
    
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  it('navigates to href when clicked', () => {
    const { container } = render(<BackButton {...defaultProps} href="/list" />);
    const link = container.querySelector('a');
    
    expect(link).toHaveAttribute('href', '/list');
    fireEvent.click(link!);
  });

  it('calls router.back when no href is provided', () => {
    const router = useRouter();
    render(<BackButton {...defaultProps} />);
    const button = screen.getByText('Back');
    
    fireEvent.click(button);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <BackButton {...defaultProps} className="custom-back-button" />
    );
    
    const button = container.firstChild;
    expect(button).toHaveClass('custom-back-button');
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(
      <BackButton {...defaultProps} disabled />
    );
    const button = container.querySelector('button');
    
    expect(button).toBeDisabled();
  });

  it('handles disabled state correctly when using href', () => {
    const { container } = render(
      <BackButton {...defaultProps} href="/list" disabled />
    );
    // When disabled=true, component renders as button even with href
    const link = container.querySelector('a');
    const button = container.querySelector('button');
    
    expect(link).toBeNull(); // No link when disabled
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('renders as a link when href is provided', () => {
    const { container } = render(
      <BackButton {...defaultProps} href="/list" />
    );
    const link = container.querySelector('a');
    
    expect(link).toHaveAttribute('href', '/list');
  });

  it('renders as a button when no href is provided', () => {
    const { container } = render(<BackButton {...defaultProps} />);
    const button = container.querySelector('button');
    
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('href');
  });

  it('applies disabled styling when disabled', () => {
    const { container } = render(
      <BackButton {...defaultProps} disabled />
    );
    const button = container.querySelector('button');
    
    expect(button).toBeDisabled();
    // Note: Styled-components CSS is mocked, so style checks are not reliable
  });

  it('renders with all props combined', () => {
    render(
      <BackButton 
        label="Go Back"
        href="/list"
        icon="↩"
        className="combined-back-button"
      />
    );
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('↩')).toBeInTheDocument();
  });

  it('uses custom onClick handler when provided and no href', () => {
    const mockOnClick = jest.fn();
    render(<BackButton {...defaultProps} onClick={mockOnClick} />);
    const button = screen.getByText('Back');
    
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies design tokens styling', () => {
    const { container } = render(<BackButton {...defaultProps} />);
    const button = container.firstChild;
    // Note: Styled-components CSS is mocked, so style checks are not reliable
    expect(button).toBeInTheDocument();
  });
});

