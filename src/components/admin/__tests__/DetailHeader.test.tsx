import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DetailHeader, { MetadataItem, ActionButton } from '../DetailHeader';

describe('DetailHeader', () => {
  const mockMetadata: MetadataItem[] = [
    { label: 'Created', value: '2025-04-13' },
    { label: 'Status', value: 'Active' },
    { label: 'Owner', value: 'John Doe' },
  ];

  const mockActions: ActionButton[] = [
    { label: 'Edit', onClick: jest.fn(), variant: 'primary' },
    { label: 'Delete', onClick: jest.fn(), variant: 'danger' },
    { label: 'Archive', onClick: jest.fn(), variant: 'secondary' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title correctly', () => {
    render(<DetailHeader title="User Details" />);
    
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('User Details');
  });

  it('renders metadata items when provided', () => {
    render(<DetailHeader title="User Details" metadata={mockMetadata} />);
    
    expect(screen.getByText('Created:')).toBeInTheDocument();
    expect(screen.getByText('2025-04-13')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Owner:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render metadata container when no metadata provided', () => {
    render(<DetailHeader title="User Details" />);
    
    expect(screen.queryByText('Created:')).not.toBeInTheDocument();
  });

  it('renders action buttons when provided', () => {
    render(<DetailHeader title="User Details" actions={mockActions} />);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('does not render actions container when no actions provided', () => {
    render(<DetailHeader title="User Details" />);
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('calls onClick handlers when action buttons are clicked', () => {
    render(<DetailHeader title="User Details" actions={mockActions} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockActions[1].onClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Archive'));
    expect(mockActions[2].onClick).toHaveBeenCalledTimes(1);
  });

  it('applies different button variants correctly', () => {
    render(<DetailHeader title="User Details" actions={mockActions} />);
    
    const editButton = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');
    const archiveButton = screen.getByText('Archive');
    
    // Check that buttons have different styling based on variant
    expect(editButton).toHaveStyle('background: #0070f3'); // primary
    expect(deleteButton).toHaveStyle('background: #dc2626'); // danger
    expect(archiveButton).toHaveStyle('background: #ffffff'); // secondary
  });

  it('handles disabled action buttons', () => {
    const disabledActions: ActionButton[] = [
      { label: 'Disabled Action', onClick: jest.fn(), disabled: true },
    ];
    
    render(<DetailHeader title="User Details" actions={disabledActions} />);
    
    const disabledButton = screen.getByText('Disabled Action');
    expect(disabledButton).toBeDisabled();
    
    fireEvent.click(disabledButton);
    expect(disabledActions[0].onClick).not.toHaveBeenCalled();
  });

  it('renders React node as metadata value', () => {
    const metadataWithNode: MetadataItem[] = [
      { 
        label: 'Status', 
        value: <span style={{ color: 'green' }}>Active</span> 
      },
    ];
    
    render(<DetailHeader title="User Details" metadata={metadataWithNode} />);
    
    const statusValue = screen.getByText('Active');
    expect(statusValue).toBeInTheDocument();
    expect(statusValue).toHaveStyle('color: green');
  });

  it('applies custom className', () => {
    const { container } = render(
      <DetailHeader title="User Details" className="custom-header" />
    );
    
    const header = container.firstChild;
    expect(header).toHaveClass('custom-header');
  });

  it('renders with all props combined', () => {
    render(
      <DetailHeader 
        title="User Details"
        metadata={mockMetadata}
        actions={mockActions}
        className="custom-header"
      />
    );
    
    // Check title
    expect(screen.getByText('User Details')).toBeInTheDocument();
    
    // Check metadata
    expect(screen.getByText('Created:')).toBeInTheDocument();
    expect(screen.getByText('2025-04-13')).toBeInTheDocument();
    
    // Check actions
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Archive')).toBeInTheDocument();
  });

  it('handles empty metadata and actions arrays', () => {
    render(
      <DetailHeader 
        title="User Details"
        metadata={[]}
        actions={[]}
      />
    );
    
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.queryByText('Created:')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('applies proper layout styling', () => {
    const { container } = render(
      <DetailHeader title="User Details" metadata={mockMetadata} actions={mockActions} />
    );
    
    const headerContainer = container.firstChild;
    expect(headerContainer).toHaveStyle('display: flex');
    expect(headerContainer).toHaveStyle('justify-content: space-between');
    expect(headerContainer).toHaveStyle('align-items: flex-start');
  });
});
