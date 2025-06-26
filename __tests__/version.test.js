import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../src/lib/db.js';

dotenv.config();

const EXPECTED_VERSION = '7.0.0';

describe('Version Consistency Tests', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('package.json version should be 7.0.0', () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf8')
    );
    expect(packageJson.version).toBe(EXPECTED_VERSION);
  });

  test('MongoDB version record should be 7.0.0', async () => {
    const Version = await import('../src/models/Version.js');
    const versionRecord = await Version.default.findOne({ isActive: true })
      .sort({ releaseDate: -1 })
      .lean();
    expect(versionRecord?.version).toBe(EXPECTED_VERSION);
  });
});
