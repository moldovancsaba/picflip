import React from 'react';

// Function to create styled component for either HTML elements or React components
const styledComponent = (element: string | React.ComponentType<any>) => (strings: TemplateStringsArray, ...exprs: any[]) => {
  const Comp = React.forwardRef((props: any, ref) => {
    const { children, ...rest } = props;

    // Convert styled props ($checked, $disabled, etc) to data attributes
    const dataProps = Object.entries(rest).reduce((acc: any, [key, value]) => {
      if (key.startsWith('$')) {
        acc[`data-${key.slice(1)}`] = value;
      }
      return acc;
    }, {});

    return React.createElement(
      element,
      {
        ref,
        'data-styled': true,
        ...rest,
        ...dataProps,
      },
      children
    );
  });

  Comp.displayName = `Styled(${typeof element === 'string' ? element : element.displayName || element.name || 'Component'})`;
  return Comp;
};

// Create the styled object with standard HTML elements
const styled = {
  div: styledComponent('div'),
  span: styledComponent('span'),
  button: styledComponent('button'),
  h1: styledComponent('h1'),
  h2: styledComponent('h2'),
  h3: styledComponent('h3'),
  h4: styledComponent('h4'),
  h5: styledComponent('h5'),
  h6: styledComponent('h6'),
  input: styledComponent('input'),
  label: styledComponent('label'),
  form: styledComponent('form'),
  select: styledComponent('select'),
  textarea: styledComponent('textarea'),
  pre: styledComponent('pre'),
  code: styledComponent('code'),
  p: styledComponent('p'),
  a: styledComponent('a'),
} as Record<string, ReturnType<typeof styledComponent>>;

// Attach the base function to handle styled(Component) cases
const styledFunction = ((component: React.ComponentType<any>) => styledComponent(component)) as typeof styled & ((component: React.ComponentType<any>) => ReturnType<typeof styledComponent>);

// Copy all properties from styled object to the function
Object.assign(styledFunction, styled);

const css = () => '';
const createGlobalStyle = () => () => null;
const ThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const keyframes = () => 'animation';

export default styledFunction;
export { css, createGlobalStyle, ThemeProvider, keyframes };
