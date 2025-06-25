const React = require('react');

const styled = (tag) => (strs, ...exprs) => {
  return React.forwardRef((props, ref) => {
    // Filter out styled-components specific props (those starting with $)
    const filteredProps = {};
    Object.keys(props || {}).forEach(key => {
      if (!key.startsWith('$')) {
        filteredProps[key] = props[key];
      }
    });
    return React.createElement(tag, { ...filteredProps, ref, className: props?.className });
  });
};

// Add common HTML tags
styled.div = styled('div');
styled.span = styled('span');
styled.button = styled('button');
styled.input = styled('input');
styled.select = styled('select');
styled.label = styled('label');
styled.form = styled('form');
styled.nav = styled('nav');
styled.h1 = styled('h1');
styled.h2 = styled('h2');
styled.h3 = styled('h3');
styled.p = styled('p');
styled.a = styled('a');
styled.textarea = styled('textarea');
styled.pre = styled('pre');
styled.code = styled('code');
styled.ul = styled('ul');
styled.li = styled('li');
styled.table = styled('table');
styled.th = styled('th');
styled.td = styled('td');
styled.tr = styled('tr');
styled.thead = styled('thead');
styled.tbody = styled('tbody');
styled.footer = styled('footer');
styled.header = styled('header');
styled.section = styled('section');
styled.article = styled('article');
styled.aside = styled('aside');
styled.main = styled('main');
styled.iframe = styled('iframe');

// Mock keyframes
const keyframes = () => 'mocked-animation';

// Set up the styled function as both default and named export
styled.keyframes = keyframes;

module.exports = styled;
