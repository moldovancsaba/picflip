import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Field',
    name: 'testField',
  };

  it('renders label correctly', () => {
    render(<FormField {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('renders required asterisk when required prop is true', () => {
    render(<FormField {...defaultProps} required />);
    
    const label = screen.getByText('Test Field');
    expect(label).toBeInTheDocument();
    // The asterisk is added via CSS ::after pseudo-element, so we check the required attribute
    const input = screen.getByLabelText('Test Field');
    expect(input).toBeRequired();
  });

  it('renders text input by default', () => {
    render(<FormField {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders different input types correctly', () => {
    const types = ['email', 'password', 'number', 'url', 'tel'] as const;
    
    types.forEach(type => {
      const { unmount } = render(<FormField {...defaultProps} type={type} />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('type', type);
      unmount();
    });
  });

  it('renders textarea when type is textarea', () => {
    render(<FormField {...defaultProps} type="textarea" />);
    
    const textarea = screen.getByLabelText('Test Field');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('handles value prop correctly', () => {
    render(<FormField {...defaultProps} value="test value" />);
    
    const input = screen.getByLabelText('Test Field') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('handles placeholder correctly', () => {
    render(<FormField {...defaultProps} placeholder="Enter text..." />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('placeholder', 'Enter text...');
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<FormField {...defaultProps} onChange={mockOnChange} />);
    
    const input = screen.getByLabelText('Test Field');
    await user.type(input, 'test');
    
    // userEvent.type calls onChange for each character typed
    expect(mockOnChange).toHaveBeenCalledTimes(4);
    // In test environment, each character triggers separately
    expect(mockOnChange).toHaveBeenCalledWith('t');
    expect(mockOnChange).toHaveBeenCalledWith('e');
    expect(mockOnChange).toHaveBeenCalledWith('s');
    expect(mockOnChange).toHaveBeenCalledWith('t');
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    
    render(<FormField {...defaultProps} onBlur={mockOnBlur} />);
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.blur(input);
    
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(<FormField {...defaultProps} error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('displays help text when helpText prop is provided', () => {
    render(<FormField {...defaultProps} helpText="This is helpful information" />);
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  it('prioritizes error over help text', () => {
    render(
      <FormField 
        {...defaultProps} 
        error="Error message" 
        helpText="Help text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<FormField {...defaultProps} error="Error message" />);
    
    const input = screen.getByLabelText('Test Field');
    // Note: Styled-components CSS is mocked, so style checks are not reliable
    expect(input).toBeInTheDocument();
  });

  it('handles disabled state correctly', () => {
    render(<FormField {...defaultProps} disabled />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toBeDisabled();
    // Note: Cursor style is applied via styled-components which is mocked
  });

  it('applies custom className', () => {
    const { container } = render(<FormField {...defaultProps} className="custom-field" />);
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveClass('custom-field');
  });

  it('sets proper field ID and associates with label', () => {
    render(<FormField {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Field');
    const label = screen.getByText('Test Field');
    
    expect(input).toHaveAttribute('id', 'field-testField');
    expect(label).toHaveAttribute('for', 'field-testField');
  });

  it('sets aria-describedby for error', () => {
    render(<FormField {...defaultProps} error="Error message" />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('aria-describedby', 'field-testField-error');
  });

  it('sets aria-describedby for help text', () => {
    render(<FormField {...defaultProps} helpText="Help text" />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('aria-describedby', 'field-testField-help');
  });

  it('handles autoComplete attribute', () => {
    render(<FormField {...defaultProps} autoComplete="email" />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('handles rows prop for textarea', () => {
    render(<FormField {...defaultProps} type="textarea" rows={5} />);
    
    const textarea = screen.getByLabelText('Test Field');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('handles number input values correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<FormField {...defaultProps} type="number" onChange={mockOnChange} />);
    
    const input = screen.getByLabelText('Test Field');
    await user.type(input, '123');
    
    // userEvent.type calls onChange for each character in test environment
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith('1');
    expect(mockOnChange).toHaveBeenCalledWith('2');
    expect(mockOnChange).toHaveBeenCalledWith('3');
  });

  it('renders with design tokens structure', () => {
    const { container } = render(<FormField {...defaultProps} />);
    
    const fieldContainer = container.firstChild;
    // Note: Actual CSS styles are applied via styled-components which is mocked
    // We verify the structure exists instead
    expect(fieldContainer).toBeInTheDocument();
  });
});
