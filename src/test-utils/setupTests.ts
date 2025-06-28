// test-utils/setupTests.ts
import React from 'react';

const createStyledComponent = (Element: string | React.ComponentType) => {
  const component = React.forwardRef(({ children, ...props }: any, ref: any) => {
    const dataProps = Object.entries(props).reduce((acc: any, [key, value]) => {
      if (key.startsWith('$')) {
        acc[`data-${key.slice(1).toLowerCase()}`] = value;
      }
      return acc;
    }, {});

    if (typeof Element === 'string') {
      return React.createElement(Element, { ref, ...props, ...dataProps }, children);
    }

    return <Element ref={ref} {...props} {...dataProps}>{children}</Element>;
  });

  component.displayName = `Styled(${typeof Element === 'string' ? Element : Element.displayName || 'Component'})`;
  return component;
};

const styled: any = new Proxy(
  () => {},
  {
    get: (_, prop) => {
      if (prop === '__esModule') return true;
      if (prop === 'default') return styled;
      if (typeof prop === 'string') {
        return () => createStyledComponent(prop);
      }
      return (...args: any[]) => createStyledComponent(prop);
    },
    apply: (_, __, [Component]) => createStyledComponent(Component),
  }
);

const css = () => '';
const createGlobalStyle = () => () => null;
const keyframes = () => 'animation';
const ThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export {
  styled as default,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
};
