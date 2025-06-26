import mongoose from 'mongoose';
import { getCurrentVersion, updateVersion } from '../src/models/Version';
import dbConnect from '../src/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('Version Management', () => {
  beforeAll(async () => {
    await dbConnect();
    // Add a small delay to ensure connection is stable
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up the versions collection before each test
    await mongoose.connection.collection('versions').deleteMany({});
  });

  test('getCurrentVersion should return 7.0.0 as the active version', async () => {
    // Setup: Create version 7.0.0
    await updateVersion('7.0.0', 'Major version bump to 7.0.0');
    
    // Test: Get current version
    const version = await getCurrentVersion();
    
    // Assert
    expect(version).toBe('7.0.0');
  });

  test('version in database should match package.json', async () => {
    const packageJson = JSON.parse(
      await readFile(new URL('../package.json', import.meta.url))
    );
    
    // Setup: Ensure the version exists in DB
    await updateVersion(packageJson.version, `Version ${packageJson.version} release`);
    
    // Test: Get current version from DB
    const dbVersion = await getCurrentVersion();
    
    // Assert: Versions should match
    expect(dbVersion).toBe(packageJson.version);
  });
});
