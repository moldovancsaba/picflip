// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

import '@testing-library/jest-dom';

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
