import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { SelectOption } from '../Select';

describe('Select', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const defaultProps = {
    label: 'Test Select',
    name: 'testSelect',
    options: mockOptions,
  };

  it('renders label correctly', () => {
    render(<Select {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('renders required asterisk when required prop is true', () => {
    render(<Select {...defaultProps} required />);
    
    const select = screen.getByLabelText('Test Select');
    expect(select).toBeRequired();
  });

  it('renders all options', () => {
    render(<Select {...defaultProps} />);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders placeholder option when provided', () => {
    render(<Select {...defaultProps} placeholder="Choose an option..." />);
    
    expect(screen.getByText('Choose an option...')).toBeInTheDocument();
    const placeholderOption = screen.getByDisplayValue('');
    expect(placeholderOption).toBeDisabled();
  });

  it('handles value prop correctly', () => {
    render(<Select {...defaultProps} value="option2" />);
    
    const select = screen.getByLabelText('Test Select') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    
    render(<Select {...defaultProps} onChange={mockOnChange} />);
    
    const select = screen.getByLabelText('Test Select');
    await user.selectOptions(select, 'option2');
    
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('calls onBlur when select loses focus', () => {
    const mockOnBlur = jest.fn();
    
    render(<Select {...defaultProps} onBlur={mockOnBlur} />);
    
    const select = screen.getByLabelText('Test Select');
    fireEvent.blur(select);
    
    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(<Select {...defaultProps} error="Please select an option" />);
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
  });

  it('displays help text when helpText prop is provided', () => {
    render(<Select {...defaultProps} helpText="Choose the best option" />);
    
    expect(screen.getByText('Choose the best option')).toBeInTheDocument();
  });

  it('prioritizes error over help text', () => {
    render(
      <Select 
        {...defaultProps} 
        error="Error message" 
        helpText="Help text" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<Select {...defaultProps} error="Error message" />);
    
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveStyle('border-color: #dc2626');
  });

  it('handles disabled state correctly', () => {
    render(<Select {...defaultProps} disabled />);
    
    const select = screen.getByLabelText('Test Select');
    expect(select).toBeDisabled();
    expect(select).toHaveStyle('cursor: not-allowed');
  });

  it('handles disabled options correctly', async () => {
    const user = userEvent.setup();
    render(<Select {...defaultProps} />);
    
    const select = screen.getByLabelText('Test Select');
    const disabledOption = screen.getByText('Option 3');
    
    expect(disabledOption).toBeDisabled();
    
    // Try to select disabled option - should not be selectable
    await user.selectOptions(select, 'option3');
    expect((select as HTMLSelectElement).value).not.toBe('option3');
  });

  it('applies custom className', () => {
    const { container } = render(<Select {...defaultProps} className="custom-select" />);
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveClass('custom-select');
  });

  it('sets proper field ID and associates with label', () => {
    render(<Select {...defaultProps} />);
    
    const select = screen.getByLabelText('Test Select');
    const label = screen.getByText('Test Select');
    
    expect(select).toHaveAttribute('id', 'select-testSelect');
    expect(label).toHaveAttribute('for', 'select-testSelect');
  });

  it('sets aria-describedby for error', () => {
    render(<Select {...defaultProps} error="Error message" />);
    
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveAttribute('aria-describedby', 'select-testSelect-error');
  });

  it('sets aria-describedby for help text', () => {
    render(<Select {...defaultProps} helpText="Help text" />);
    
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveAttribute('aria-describedby', 'select-testSelect-help');
  });

  it('renders dropdown icon', () => {
    const { container } = render(<Select {...defaultProps} />);
    
    const icon = container.querySelector('div:last-child');
    expect(icon).toHaveTextContent('▼');
  });

  it('handles numeric option values', async () => {
    const user = userEvent.setup();
    const numericOptions: SelectOption[] = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    const mockOnChange = jest.fn();
    
    render(
      <Select 
        label="Numeric Select"
        name="numericSelect"
        options={numericOptions}
        onChange={mockOnChange}
      />
    );
    
    const select = screen.getByLabelText('Numeric Select');
    await user.selectOptions(select, '2');
    
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('handles empty options array', () => {
    render(
      <Select 
        label="Empty Select"
        name="emptySelect"
        options={[]}
      />
    );
    
    const select = screen.getByLabelText('Empty Select');
    expect(select).toBeInTheDocument();
    // Should only have placeholder if provided
    expect(select.children.length).toBe(0);
  });

  it('applies design tokens styling', () => {
    const { container } = render(<Select {...defaultProps} />);
    
    const fieldContainer = container.firstChild;
    expect(fieldContainer).toHaveStyle('display: flex');
    expect(fieldContainer).toHaveStyle('flex-direction: column');
    
    const selectElement = screen.getByLabelText('Test Select');
    expect(selectElement).toHaveStyle('appearance: none');
  });
});
