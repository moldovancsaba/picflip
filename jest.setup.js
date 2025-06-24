// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

const React = require('react');
require('@testing-library/jest-dom');

// Set up environment variables for testing
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Mock Web APIs for Next.js server components
global.Request = global.Request || class Request {
  constructor(input, init) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }
  
  async json() {
    return JSON.parse(this.body || '{}');
  }
  
  async text() {
    return this.body || '';
  }
};

global.Response = global.Response || class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers);
  }
  
  static json(data, init) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }
  
  async json() {
    return JSON.parse(this.body);
  }
  
  async text() {
    return this.body;
  }
};

global.Headers = global.Headers || class Headers {
  constructor(init) {
    this.map = new Map();
    if (init) {
      if (init instanceof Headers) {
        init.forEach((value, key) => this.set(key, value));
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.set(key, value));
      } else {
        Object.entries(init).forEach(([key, value]) => this.set(key, value));
      }
    }
  }
  
  set(key, value) {
    this.map.set(key.toLowerCase(), value);
  }
  
  get(key) {
    return this.map.get(key.toLowerCase());
  }
  
  has(key) {
    return this.map.has(key.toLowerCase());
  }
  
  forEach(callback) {
    this.map.forEach((value, key) => callback(value, key));
  }
};

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock TextEncoder for JWT library
global.TextEncoder = global.TextEncoder || class TextEncoder {
  encode(str) {
    return new Uint8Array(Buffer.from(str, 'utf8'));
  }
};

global.TextDecoder = global.TextDecoder || class TextDecoder {
  decode(bytes) {
    return Buffer.from(bytes).toString('utf8');
  }
};

// Mock styled-components for testing
jest.mock('styled-components', () => {
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
  
  // Mock keyframes
  const keyframes = () => 'mocked-animation';
  
  // Set up the styled function as both default and named export
  styled.keyframes = keyframes;
  
  return styled;
});

// Mock mongoose for API route tests
jest.mock('mongoose', () => {
  const mockSchema = function(definition) {
    this.definition = definition;
    this.indexes = [];
  };
  
  mockSchema.prototype.index = function(spec, options) {
    this.indexes.push({ spec, options });
    return this;
  };
  
  mockSchema.prototype.pre = function(hook, fn) {
    // Mock pre-save hooks
    return this;
  };
  
  mockSchema.prototype.post = function(hook, fn) {
    // Mock post-save hooks
    return this;
  };
  
  mockSchema.prototype.virtual = function(name, options) {
    // Mock virtual fields
    return {
      get: function() { return this; },
      set: function() { return this; },
    };
  };
  
  mockSchema.Types = {
    ObjectId: 'MockObjectId',
  };
  
  return {
    default: {
      connect: jest.fn(),
      connection: {
        readyState: 1,
      },
      Schema: mockSchema,
      model: jest.fn(),
      models: {},
    },
    connect: jest.fn(),
    connection: {
      readyState: 1,
    },
    Schema: mockSchema,
    model: jest.fn(),
    models: {},
  };
});

// Mock MongoDB connection
jest.mock('@/lib/db', () => jest.fn().mockResolvedValue({}));

// Global test setup can be added here if needed
