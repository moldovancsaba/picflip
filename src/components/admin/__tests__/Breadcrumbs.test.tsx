import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Breadcrumbs', () => {
  const mockItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'John Doe' }, // No href for current page
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumbs items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders links for items with href (except last item)', () => {
    render(<Breadcrumbs items={mockItems} />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const adminLink = screen.getByText('Admin').closest('a');
    const usersLink = screen.getByText('Users').closest('a');
    const currentItem = screen.getByText('John Doe');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(adminLink).toHaveAttribute('href', '/admin');
    expect(usersLink).toHaveAttribute('href', '/admin/users');
    expect(currentItem.closest('a')).toBeNull(); // Current page should not be a link
  });

  it('sets aria-current="page" on the last item', () => {
    render(<Breadcrumbs items={mockItems} />);
    
    const currentItem = screen.getByText('John Doe');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders separators between items', () => {
    render(<Breadcrumbs items={mockItems} />);
    
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(3); // 4 items = 3 separators
    
    separators.forEach(separator => {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('uses custom separator when provided', () => {
    render(<Breadcrumbs items={mockItems} separator=">" />);
    
    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(3);
  });

  it('renders with custom className', () => {
    const { container } = render(<Breadcrumbs items={mockItems} className="custom-breadcrumbs" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-breadcrumbs');
  });

  it('has proper aria-label for navigation', () => {
    render(<Breadcrumbs items={mockItems} />);
    
    const nav = screen.getByLabelText('Breadcrumb');
    expect(nav).toBeInTheDocument();
  });

  it('returns null when items array is empty', () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items is undefined', () => {
    const { container } = render(<Breadcrumbs items={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles single item correctly', () => {
    const singleItem: BreadcrumbItem[] = [{ label: 'Single Page' }];
    render(<Breadcrumbs items={singleItem} />);
    
    expect(screen.getByText('Single Page')).toBeInTheDocument();
    expect(screen.getByText('Single Page')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('/')).not.toBeInTheDocument(); // No separators
  });

  it('handles item with href but is last item (should not render as link)', () => {
    const itemsWithLastHref: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Current', href: '/current' }, // Has href but is last
    ];
    
    render(<Breadcrumbs items={itemsWithLastHref} />);
    
    const homeLink = screen.getByText('Home').closest('a');
    const currentItem = screen.getByText('Current');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(currentItem.closest('a')).toBeNull(); // Should not be a link even with href
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('applies design tokens styling', () => {
    const { container } = render(<Breadcrumbs items={mockItems} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveStyle('display: flex');
    expect(nav).toHaveStyle('align-items: center');
  });
});
