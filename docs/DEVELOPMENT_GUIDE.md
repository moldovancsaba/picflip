# Development Implementation Guide

## Overview

This guide provides best practices, error prevention strategies, and safe implementation patterns for Picito development. It's based on lessons learned from previous API development challenges and establishes patterns for consistent, reliable feature development.

**Last Updated:** 2025-06-24T07:35:13.000Z

## Common Implementation Risks & Solutions

### 1. Database Connection Issues

#### Potential Problems
- MongoDB connection pooling conflicts with new models
- Mongoose model compilation errors if models are imported multiple times
- Connection timeout during development
- Schema index creation failures

#### Solutions
```typescript
// ✅ Safe model creation pattern (reuse existing pattern)
export default mongoose.models.ModelName || mongoose.model<IModelName>('ModelName', modelSchema);

// ✅ Safe database connection (reuse existing /src/lib/db.ts)
import { connectDB } from '@/lib/db';

// ✅ Handle index creation gracefully
modelSchema.index({ field: 1 }, { background: true, unique: true });
```

#### Best Practices
- Always reuse existing `/src/lib/db.ts` connection pattern
- Test database connectivity before schema changes
- Use background index creation for production safety
- Handle connection errors gracefully with proper error messages

### 2. API Route Structure Issues

#### Potential Problems
- Next.js App Router dynamic route conflicts
- Middleware authentication not working with nested routes
- GET request caching issues in development
- Route handler export naming conflicts

#### Solutions
```typescript
// ✅ Follow existing API structure pattern
// File: /src/app/api/organisations/route.ts
export async function GET(request: Request) {
  // Implementation
}

export async function POST(request: Request) {
  // Implementation
}

// ✅ Dynamic routes pattern
// File: /src/app/api/organisations/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Implementation
}
```

#### Best Practices
- Follow existing `/src/app/api/admin/users/route.ts` structure as template
- Use proper HTTP method exports (`GET`, `POST`, `DELETE`, `PATCH`)
- Add explicit `cache: 'no-store'` for dynamic data
- Test route structure with simple endpoints first

### 3. Authentication & Authorization Issues

#### Potential Problems
- New APIs not protected by existing middleware
- Role-based access not properly implemented
- Session validation failing on organisation routes
- Middleware not covering new route patterns

#### Solutions
```typescript
// ✅ Copy authentication pattern from existing admin routes
import { NextRequest } from 'next/server';
import { verify } from 'jose';

export async function GET(request: NextRequest) {
  try {
    // 1. Extract and verify JWT token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify session (copy from existing pattern)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await verify(token, secret);
    
    // 3. Check role-based permissions
    if (payload.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Proceed with business logic
    // ...
  } catch (error) {
    return Response.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
```

#### Best Practices
- Extend existing middleware to cover `/api/organisations/*` routes
- Implement role hierarchy validation (owner > admin > member)
- Always check authentication before business logic
- Return consistent error responses (401, 403, 500)

### 4. Data Relationship Issues

#### Potential Problems
- Foreign key relationships not properly enforced
- Circular dependency between User and Organisation models
- Data consistency issues when creating memberships
- Orphaned data when deleting entities

#### Solutions
```typescript
// ✅ Use MongoDB ObjectId references
import { Schema, Types } from 'mongoose';

const membershipSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  organisationId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    required: true
  }
});

// ✅ Compound unique index
membershipSchema.index({ userId: 1, organisationId: 1 }, { unique: true });
```

#### Best Practices
- Use MongoDB ObjectId references instead of foreign keys
- Import models carefully to avoid circular dependencies
- Implement transactional operations for critical data consistency
- Always validate referenced entities exist before creating relationships

### 5. Model Schema Conflicts

#### Potential Problems
- Mongoose schema conflicts with existing models
- TypeScript type conflicts between interfaces
- Model re-compilation errors in development
- Schema validation conflicts

#### Solutions
```typescript
// ✅ Separate TypeScript interfaces from Mongoose schemas
export interface IOrganisation {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Clear schema definition
const organisationSchema = new Schema<IOrganisation>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-z0-9-]+$/
  },
  description: { 
    type: String, 
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});
```

#### Best Practices
- Create proper TypeScript interfaces separate from Mongoose schemas
- Use separate database collections with clear naming conventions
- Handle schema validation errors gracefully
- Test schema changes in development before production

## Safe Implementation Strategy

### Phase 1: Foundation First (Risk Assessment)
1. **Diagnostic Check**
   ```bash
   # Test existing API endpoints
   curl -X GET http://localhost:3000/api/admin/users
   curl -X GET http://localhost:3000/api/settings
   ```

2. **Database Connection Verification**
   ```typescript
   // Test in existing API route
   import { connectDB } from '@/lib/db';
   const db = await connectDB();
   console.log('DB Status:', db.connection.readyState);
   ```

3. **Create Backup Branch**
   ```bash
   git checkout -b feature/organisation-membership
   git push -u origin feature/organisation-membership
   ```

### Phase 2: Incremental Development
1. **Model Creation** (Start with Organisation model only)
2. **Simple GET Endpoint** (Test route structure)
3. **Authentication Integration** (Copy existing patterns)
4. **Full CRUD Operations** (Add remaining endpoints)

### Phase 3: Integration Testing
1. **Manual API Testing** with curl/Postman
2. **Verify No Breaking Changes** to existing functionality
3. **Check Middleware Coverage** for all new routes
4. **Performance Testing** with new database queries

## Development Checklist

### Before Implementation
- [ ] Current API endpoints functioning properly
- [ ] Database connection stable
- [ ] Middleware authentication working
- [ ] Backup branch created
- [ ] Implementation plan documented

### During Implementation
- [ ] Follow existing code patterns
- [ ] Implement proper error handling
- [ ] Add TypeScript types for all new entities
- [ ] Test each component individually
- [ ] Commit frequently with descriptive messages

### After Implementation
- [ ] Manual API testing completed
- [ ] No breaking changes to existing features
- [ ] Documentation updated
- [ ] Build and dev commands successful
- [ ] Performance impact assessed

## Error Handling Patterns

### API Error Responses
```typescript
// ✅ Consistent error response format
return Response.json(
  { 
    error: 'Error message',
    code: 'ERROR_CODE',
    timestamp: new Date().toISOString()
  }, 
  { status: 400 }
);
```

### Database Error Handling
```typescript
// ✅ Graceful database error handling
try {
  await connectDB();
  // Database operations
} catch (error) {
  console.error('Database error:', error);
  return Response.json(
    { error: 'Database connection failed' },
    { status: 500 }
  );
}
```

### Validation Error Handling
```typescript
// ✅ Input validation with clear messages
if (!name || name.trim().length === 0) {
  return Response.json(
    { error: 'Organisation name is required' },
    { status: 400 }
  );
}
```

## Testing Guidelines

### API Testing Commands
```bash
# Test organisation creation
curl -X POST http://localhost:3000/api/organisations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Org", "description": "Test Description"}'

# Test membership management
curl -X GET http://localhost:3000/api/organisations/[id]/members

# Test authentication
curl -X GET http://localhost:3000/api/organisations \
  -H "Cookie: token=your_jwt_token"
```

### Development Server Testing
```bash
# Always run after changes
npm install && npm run build && npm run dev
```

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall project structure
- [LEARNINGS.md](../LEARNINGS.md) - Development insights
- [ROADMAP.md](../ROADMAP.md) - Feature planning
- [TASKLIST.md](../TASKLIST.md) - Task tracking

## Troubleshooting

### Common Issues
1. **"Module not found" errors**: Check import paths and TypeScript configuration
2. **Database connection timeouts**: Verify MongoDB Atlas connection string
3. **Authentication failures**: Check JWT secret and token format
4. **Route not found (404)**: Verify file structure matches Next.js App Router conventions
5. **Middleware not executing**: Check middleware.ts file and route patterns

### Debug Commands
```bash
# Check current git status
git status

# Verify Node.js and npm versions
node --version && npm --version

# Check Next.js build output
npm run build

# View detailed error logs
npm run dev 2>&1 | tee debug.log
```

---

**Remember**: Always test incrementally and follow existing patterns to ensure consistency and reliability.
