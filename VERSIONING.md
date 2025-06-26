# Automatic Versioning System

This project uses an automated semantic versioning system that follows strict rules for version bumping and release documentation.

## Version Format

We use **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (manually triggered)
- **MINOR**: New features, commits to GitHub
- **PATCH**: Bug fixes, successful development builds

## Versioning Rules

### Rule 1: Development Build Success
- **Trigger**: After successful `npm run dev`
- **Action**: Increment PATCH version (third digit +1)
- **Example**: `2.9.0` → `2.9.1`

### Rule 2: GitHub Commit
- **Trigger**: After commit to GitHub
- **Action**: Increment MINOR version (second digit +1, third digit = 0)
- **Example**: `2.9.1` → `2.10.0`

### Rule 3: Major Release
- **Trigger**: Manual major release
- **Action**: Increment MAJOR version (first digit +1, second digit = 0, third digit = 0)
- **Example**: `2.10.0` → `3.0.0`

## Automated Scripts

### Manual Version Bumping

```bash
# After successful npm run dev
npm run version:dev

# After commit to GitHub
npm run version:commit

# For major releases
npm run version:major
```

### Integrated Workflows

```bash
# Run dev server and auto-bump on success
npm run dev:complete

# Bump version, commit, and push to GitHub
npm run commit:complete
```

## What Gets Updated

When a version is bumped, the following files are automatically updated:

1. **`package.json`** - Main version field
2. **`src/models/Version.ts`** - Version model and database interface
3. **`src/app/api/version/route.ts`** - Version API endpoint
4. **`RELEASE_NOTES.md`** - New release entry with timestamp

## Release Notes Format

Each version bump automatically adds an entry to `RELEASE_NOTES.md` with:

- **Version number** and **ISO timestamp** (2025-06-24T12:54:36.789Z format)
- **Release type** (Development Build, Minor Release, Major Release)
- **Version bump details** (previous → new version)
- **Technical details** (bump type, timestamp, auto-generated flag)

## Database Integration

The system integrates with the MongoDB Version model:

- **API Endpoint**: `/api/version` (GET for current version, POST for updates)
- **Database Storage**: Version history with timestamps and descriptions
- **Error Handling**: Proper error responses if database is unavailable

## Manual Usage

### Using the Script Directly

```bash
# Direct script usage
node scripts/bump-version.js dev
node scripts/bump-version.js commit  
node scripts/bump-version.js major
```

### Using npm Scripts

```bash
# Recommended approach
npm run version:dev
npm run version:commit
npm run version:major
```

## Timestamp Format

All timestamps follow **ISO 8601 with milliseconds**:
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2025-06-24T12:54:36.789Z`
- Used in: Release notes, database entries, API responses

## Integration Points

### Files Updated
- `package.json` - Main version
- `src/models/Version.ts` - Version model and database interface
- `src/app/api/version/route.ts` - Version API endpoint
- `RELEASE_NOTES.md` - Release documentation

### API Integration
- **GET `/api/version`** - Returns current version
- **POST `/api/version`** - Updates version (admin only)
- Database-backed with fallback support

### Development Workflow
1. Make changes to code
2. Run `npm run dev:complete` (dev + version bump)
3. Test changes
4. Run `npm run commit:complete` (version bump + git commit + push)

## Error Handling

The versioning system includes comprehensive error handling:

- **Validation**: Ensures semantic versioning format
- **File Checks**: Verifies required files exist before updating
- **Rollback**: Manual rollback instructions if needed
- **Logging**: Detailed console output for debugging

## Best Practices

1. **Always test before committing**: Use `npm run dev:complete`
2. **Use integrated workflows**: Prefer `npm run commit:complete`
3. **Review release notes**: Check auto-generated entries
4. **Major releases**: Plan and document breaking changes
5. **Database sync**: Ensure version API stays in sync

## Troubleshooting

### Common Issues

1. **Permission errors**: Ensure script is executable (`chmod +x scripts/bump-version.js`)
2. **File not found**: Check that all required files exist
3. **Invalid version**: Verify current version follows semantic versioning
4. **Git errors**: Ensure repository is clean and has remote origin

### Manual Recovery

If automatic versioning fails:

1. Check current version: `cat package.json | grep version`
2. Manually update files if needed
3. Run script again: `npm run version:dev`
4. Verify all files updated correctly

## Current Status

- **Current Version**: 2.9.0
- **Last Updated**: 2025-06-24T12:54:36.789Z
- **System Status**: Active and fully automated
- **Integration**: Complete with database and API
