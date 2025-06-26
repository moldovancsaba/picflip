# Technology Stack

## Versioning
The application uses a database-driven versioning system rather than npm's traditional version field. This approach was chosen to:
- Enable centralized version management across the entire system
- Maintain version consistency between the UI, API, and database layers
- Support more granular version tracking with DB-specific metadata

### Version Management
- Versions are stored and managed in MongoDB
- The `npm publish` command is intentionally disabled
- Version updates are handled through dedicated scripts in the `scripts/` directory

### Important Notes
- Do not attempt to use `npm publish` as it will fail by design
- All version-related operations should be performed through the database and our custom version management scripts
- The package.json no longer contains a version field - this is intentional
