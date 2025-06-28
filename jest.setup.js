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
    // Use Object.defineProperty to avoid conflicts with NextRequest
    Object.defineProperty(this, 'url', {
      value: typeof input === 'string' ? input : input.url,
      writable: false,
      configurable: true
    });
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


// Mock mongoose for API route tests
const mockMongoose = {
  Schema: class Schema {
    constructor(definition) {
      this.definition = definition;
      this.virtuals = {};
      this.methods = {};
      this.statics = {};
    }
    
    index(fields, options) {
      return this;
    }
    
    virtual(name) {
      this.virtuals[name] = {
        get: (fn) => { this.virtuals[name].getter = fn; },
        set: (fn) => { this.virtuals[name].setter = fn; }
      };
      return this.virtuals[name];
    }
    
    pre() { return this; }
    post() { return this; }
  },
  
  model: (name, schema) => {
    if (!mockMongoose.models[name]) {
      mockMongoose.models[name] = class Model {
        constructor(data) {
          Object.assign(this, data);
        }
        static findOne() { return Promise.resolve(null); }
        static find() { return Promise.resolve([]); }
        static create(data) { return Promise.resolve(new this(data)); }
        save() { return Promise.resolve(this); }
      };
    }
    return mockMongoose.models[name];
  },
  
  models: {},
  connect: jest.fn().mockResolvedValue({}),
  connection: { readyState: 1 }
};

jest.mock('mongoose', () => mockMongoose);

// Mock MongoDB connection
jest.mock('@/lib/db', () => jest.fn().mockResolvedValue({}));

// Mock styled-components with enhanced data-attribute support
const createStyledComponent = (tag) => {
  const StyledComponent = ({ children, ...props }) => {
    // Convert styled props ($checked, $disabled, etc) to data attributes
    const dataProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (key.startsWith('$')) {
        acc[`data-${key.slice(1)}`] = value;
      }
      return acc;
    }, {});
    
    return React.createElement(tag, { ...props, ...dataProps }, children);
  };
  StyledComponent.displayName = `Styled(${tag})`;
  return StyledComponent;
};

const styled = new Proxy({}, {
  get: (_, prop) => {
    if (typeof prop === 'string') {
      return createStyledComponent(prop);
    }
    return () => createStyledComponent(prop);
  }
});

jest.mock('styled-components', () => ({
  __esModule: true,
  default: styled,
  styled,
  css: (...args) => args.join(''),
  createGlobalStyle: () => () => null,
  keyframes: () => 'animation',
  ThemeProvider: ({ children }) => children
}));

// Global test setup can be added here if needed
