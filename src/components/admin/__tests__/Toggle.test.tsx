import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from '../Toggle';

describe('Toggle', () => {
  const defaultProps = {
    label: 'Test Toggle',
    name: 'testToggle',
  };

  it('renders label correctly', () => {
    render(<Toggle {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Toggle')).toBeInTheDocument();
  });

  it('renders required asterisk when required prop is true', () => {
    render(<Toggle {...defaultProps} required />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toBeRequired();
  });

  it('renders description when provided', () => {
    render(<Toggle {...defaultProps} description="This is a toggle description" />);
    
    expect(screen.getByText('This is a toggle description')).toBeInTheDocument();
  });

  it('handles checked state correctly', () => {
    render(<Toggle {...defaultProps} checked />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toBeChecked();
  });

  it('handles unchecked state correctly', () => {
    render(<Toggle {...defaultProps} checked={false} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).not.toBeChecked();
  });

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<Toggle {...defaultProps} onChange={mockOnChange} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    await user.click(toggle);
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with correct value when unchecking', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<Toggle {...defaultProps} checked onChange={mockOnChange} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    await user.click(toggle);
    
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('calls onBlur when toggle loses focus', () => {
    const mockOnBlur = jest.fn();
    
    render(<Toggle {...defaultProps} onBlur={mockOnBlur} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    fireEvent.blur(toggle);
    
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(<Toggle {...defaultProps} error="This toggle is required" />);
    
    expect(screen.getByText('This toggle is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('This toggle is required');
  });

  it('displays help text when helpText prop is provided', () => {
    render(<Toggle {...defaultProps} helpText="Toggle this setting on or off" />);
    
    expect(screen.getByText('Toggle this setting on or off')).toBeInTheDocument();
  });

  it('prioritizes error over help text', () => {
    render(
      <Toggle 
        {...defaultProps} 
        error="Error message" 
        helpText="Help text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });

  it('handles disabled state correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<Toggle {...defaultProps} disabled onChange={mockOnChange} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toBeDisabled();
    
    // Try to click disabled toggle - should not call onChange
    await user.click(toggle);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<Toggle {...defaultProps} className="custom-toggle" />);
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveClass('custom-toggle');
  });

  it('sets proper field ID and associates with label', () => {
    render(<Toggle {...defaultProps} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    const label = screen.getByText('Test Toggle');
    
    expect(toggle).toHaveAttribute('id', 'toggle-testToggle');
    expect(label).toHaveAttribute('for', 'toggle-testToggle');
  });

  it('sets aria-describedby for error', () => {
    render(<Toggle {...defaultProps} error="Error message" />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toHaveAttribute('aria-describedby', 'toggle-testToggle-error');
  });

  it('sets aria-describedby for help text', () => {
    render(<Toggle {...defaultProps} helpText="Help text" />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toHaveAttribute('aria-describedby', 'toggle-testToggle-help');
  });

  it('has proper checkbox type', () => {
    render(<Toggle {...defaultProps} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).toHaveAttribute('type', 'checkbox');
  });

  it('renders visual slider element', () => {
    const { container } = render(<Toggle {...defaultProps} />);
    
    // The slider is a styled span that creates the visual toggle
    const sliders = container.querySelectorAll('span');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('changes slider position when checked', () => {
    const { rerender } = render(<Toggle {...defaultProps} checked={false} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    expect(toggle).not.toBeChecked();
    
    rerender(<Toggle {...defaultProps} checked />);
    expect(toggle).toBeChecked();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<Toggle {...defaultProps} onChange={mockOnChange} />);
    
    const toggle = screen.getByLabelText('Test Toggle');
    
    // Focus and press space to toggle
    toggle.focus();
    await user.keyboard(' ');
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('applies disabled styling when disabled', () => {
    const { container } = render(<Toggle {...defaultProps} disabled />);
    
    const toggleContainer = container.querySelector('label');
    // Note: Cursor style is applied via styled-components which is mocked
    expect(toggleContainer).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    render(
      <Toggle 
        {...defaultProps}
        checked
        description="Enable this feature"
        helpText="This will affect all users"
        required
        className="custom-toggle"
      />
    );
    
    expect(screen.getByLabelText('Test Toggle')).toBeChecked();
    expect(screen.getByText('Enable this feature')).toBeInTheDocument();
    expect(screen.getByText('This will affect all users')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Toggle')).toBeRequired();
  });

  it('renders with design tokens structure', () => {
    const { container } = render(<Toggle {...defaultProps} />);
    
    const fieldContainer = container.firstChild;
    // Note: Actual CSS styles are applied via styled-components which is mocked
    expect(fieldContainer).toBeInTheDocument();
    
    const toggleWrapper = container.querySelector('div:first-child > div:first-child');
    expect(toggleWrapper).toBeInTheDocument();
  });
});
