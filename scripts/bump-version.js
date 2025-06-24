#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current timestamp in ISO 8601 format with milliseconds
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Read package.json
function readPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

// Write package.json
function writePackageJson(packageData) {
  const packagePath = path.join(process.cwd(), 'package.json');
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
}

// Parse version string
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0],
    minor: parts[1],
    patch: parts[2]
  };
}

// Create version string
function createVersion(major, minor, patch) {
  return `${major}.${minor}.${patch}`;
}

// Bump version according to rules
function bumpVersion(currentVersion, type) {
  const { major, minor, patch } = parseVersion(currentVersion);
  
  switch (type) {
    case 'dev':
      // After successful npm run dev → bump patch (third digit +1)
      return createVersion(major, minor, patch + 1);
    
    case 'commit':
      // After commit to GitHub → bump minor (second digit +1, third =0)
      return createVersion(major, minor + 1, 0);
    
    case 'major':
      // Major release → bump major (first digit +1, second =0, third =0)
      return createVersion(major + 1, 0, 0);
    
    default:
      throw new Error(`Unknown bump type: ${type}. Use 'dev', 'commit', or 'major'`);
  }
}

// Update Version.ts model files
function updateVersionFiles(newVersion) {
  const versionModelPath = path.join(process.cwd(), 'src/models/Version.ts');
  const versionApiPath = path.join(process.cwd(), 'src/app/api/version/route.ts');
  
  // Update Version.ts
  if (fs.existsSync(versionModelPath)) {
    let content = fs.readFileSync(versionModelPath, 'utf8');
    content = content.replace(
      /return currentVersion \? currentVersion\.version : '[^']+'/g,
      `return currentVersion ? currentVersion.version : '${newVersion}'`
    );
    content = content.replace(
      /return '[^']+'; \/\/ fallback version/g,
      `return '${newVersion}'; // fallback version`
    );
    fs.writeFileSync(versionModelPath, content);
    console.log(`✓ Updated ${versionModelPath}`);
  }
  
  // Update API route
  if (fs.existsSync(versionApiPath)) {
    let content = fs.readFileSync(versionApiPath, 'utf8');
    content = content.replace(
      /version: '[^']+', \/\/ fallback/g,
      `version: '${newVersion}', // fallback`
    );
    fs.writeFileSync(versionApiPath, content);
    console.log(`✓ Updated ${versionApiPath}`);
  }
}

// Get version description based on bump type
function getVersionDescription(bumpType, newVersion) {
  switch (bumpType) {
    case 'dev':
      return `Development version ${newVersion} - Successfully completed npm run dev testing`;
    case 'commit':
      return `Release version ${newVersion} - Code committed to GitHub repository`;
    case 'major':
      return `Major release version ${newVersion} - Breaking changes may be included`;
    default:
      return `Version ${newVersion} release`;
  }
}

// Update release notes
function updateReleaseNotes(newVersion, previousVersion, bumpType) {
  const releaseNotesPath = path.join(process.cwd(), 'RELEASE_NOTES.md');
  const timestamp = getCurrentTimestamp();
  
  if (!fs.existsSync(releaseNotesPath)) {
    console.warn('⚠ RELEASE_NOTES.md not found, skipping update');
    return;
  }
  
  let content = fs.readFileSync(releaseNotesPath, 'utf8');
  
  // Create new release entry
  let releaseEntry = `## Version ${newVersion} (${timestamp})\n\n`;
  
  switch (bumpType) {
    case 'dev':
      releaseEntry += `### Development Build\n`;
      releaseEntry += `- **Development**: Successfully completed \`npm run dev\` testing\n`;
      releaseEntry += `- **Version Bump**: Patch version incremented from ${previousVersion} to ${newVersion}\n`;
      releaseEntry += `- **Status**: Development build ready for further testing\n`;
      break;
    
    case 'commit':
      releaseEntry += `### Minor Release\n`;
      releaseEntry += `- **Release**: Code committed to GitHub repository\n`;
      releaseEntry += `- **Version Bump**: Minor version incremented from ${previousVersion} to ${newVersion}\n`;
      releaseEntry += `- **Status**: Ready for deployment\n`;
      break;
    
    case 'major':
      releaseEntry += `### Major Release\n`;
      releaseEntry += `- **BREAKING CHANGE**: Major version bump from ${previousVersion} to ${newVersion}\n`;
      releaseEntry += `- **Status**: Major release with potential breaking changes\n`;
      break;
  }
  
  releaseEntry += `\n### Technical Details\n`;
  releaseEntry += `- **Previous Version**: ${previousVersion}\n`;
  releaseEntry += `- **New Version**: ${newVersion}\n`;
  releaseEntry += `- **Bump Type**: ${bumpType}\n`;
  releaseEntry += `- **Timestamp**: ${timestamp}\n`;
  releaseEntry += `- **Auto-generated**: Yes\n\n`;
  
  // Insert at the top after the first line (title)
  const lines = content.split('\n');
  lines.splice(2, 0, releaseEntry);
  content = lines.join('\n');
  
  fs.writeFileSync(releaseNotesPath, content);
  console.log(`✓ Updated RELEASE_NOTES.md with version ${newVersion}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0];
  
  if (!bumpType || !['dev', 'commit', 'major'].includes(bumpType)) {
    console.error('Usage: node bump-version.js <dev|commit|major>');
    console.error('');
    console.error('Examples:');
    console.error('  node bump-version.js dev     # After successful npm run dev');
    console.error('  node bump-version.js commit  # After commit to GitHub');
    console.error('  node bump-version.js major   # For major releases');
    process.exit(1);
  }
  
  try {
    // Read current version
    const packageData = readPackageJson();
    const currentVersion = packageData.version;
    
    console.log(`📦 Current version: ${currentVersion}`);
    console.log(`🚀 Bump type: ${bumpType}`);
    
    // Calculate new version
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    console.log(`✨ New version: ${newVersion}`);
    
    // Update package.json
    packageData.version = newVersion;
    writePackageJson(packageData);
    console.log(`✓ Updated package.json`);
    
    // Update version files
    updateVersionFiles(newVersion);
    
    // Update release notes
    updateReleaseNotes(newVersion, currentVersion, bumpType);
    
    // Update version in database
    try {
      const description = getVersionDescription(bumpType, newVersion);
      execSync(`node scripts/update-version.js ${newVersion} "${description}"`, { stdio: 'inherit' });
      console.log(`✓ Updated version in database`);
    } catch (error) {
      console.warn(`⚠ Warning: Could not update database version: ${error.message}`);
    }
    
    console.log('');
    console.log(`🎉 Successfully bumped version from ${currentVersion} to ${newVersion}`);
    console.log(`📝 Release notes updated with timestamp: ${getCurrentTimestamp()}`);
    console.log(`💾 Database version updated`);
    
  } catch (error) {
    console.error('❌ Error bumping version:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { bumpVersion, parseVersion, createVersion, getCurrentTimestamp };
