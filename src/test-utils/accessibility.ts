// Verify proper HTML structure and accessibility attributes
import '@testing-library/jest-dom';

export const validateAccessibility = (container: HTMLElement) => {
  // Verify label-input associations
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = container.querySelector(`label[for="${id}"]`);
    expect(label).toBeInTheDocument();
  });

  // Verify ARIA attributes
  const ariaElements = container.querySelectorAll('[aria-*]');
  ariaElements.forEach(el => {
    const describedBy = el.getAttribute('aria-describedby');
    if (describedBy) {
      const description = container.getElementById(describedBy);
      expect(description).toBeInTheDocument();
    }
  });
};
