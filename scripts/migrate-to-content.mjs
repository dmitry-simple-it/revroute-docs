/**
 * Migrate MDX content from app/ directory to content/en/ for Nextra i18n support.
 * Converts app page.mdx files to content/en directory structure
 * Copies _meta.js files preserving structure.
 */

import fs from 'fs'
import path from 'path'

const APP_DIR = './app'
const CONTENT_DIR = './content/en'

// Collect all page.mdx files and _meta.js files
function findFiles(dir, pattern, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next' && !entry.name.startsWith('[')) {
      findFiles(fullPath, pattern, results)
    } else if (entry.name === pattern) {
      results.push(fullPath)
    }
  }
  return results
}

// Check if a directory has subdirectories with page.mdx (i.e., it's an index, not a leaf)
function hasChildPages(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name)
      if (fs.existsSync(path.join(subDir, 'page.mdx')) ||
          fs.readdirSync(subDir, { withFileTypes: true }).some(e => e.isDirectory())) {
        return true
      }
    }
  }
  return false
}

fs.mkdirSync(CONTENT_DIR, { recursive: true })

// 1. Migrate page.mdx files
const mdxFiles = findFiles(APP_DIR, 'page.mdx')
console.log(`Found ${mdxFiles.length} page.mdx files`)

for (const mdxPath of mdxFiles) {
  // app/help/managing-a-program/getting-started/setting-up-your-program/page.mdx
  // → content/en/help/managing-a-program/getting-started/setting-up-your-program.mdx (leaf)
  // OR → content/en/help/managing-a-program/getting-started/index.mdx (has children)

  const dir = path.dirname(mdxPath) // app/help/.../setting-up-your-program
  const relDir = path.relative(APP_DIR, dir) // help/.../setting-up-your-program

  if (relDir === '') {
    // Root page.mdx → content/en/index.mdx
    const dest = path.join(CONTENT_DIR, 'index.mdx')
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(mdxPath, dest)
    console.log(`  ${mdxPath} → ${dest}`)
    continue
  }

  const parentDir = path.dirname(relDir) // help/.../getting-started
  const dirName = path.basename(relDir) // setting-up-your-program

  // Check if this directory has child directories
  if (hasChildPages(dir)) {
    // It's a parent with children → index.mdx
    const dest = path.join(CONTENT_DIR, relDir, 'index.mdx')
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(mdxPath, dest)
    console.log(`  ${mdxPath} → ${dest} (index)`)
  } else {
    // It's a leaf → dirName.mdx in parent
    const dest = path.join(CONTENT_DIR, parentDir, `${dirName}.mdx`)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(mdxPath, dest)
    console.log(`  ${mdxPath} → ${dest} (leaf)`)
  }
}

// 2. Migrate _meta.js files
const metaFiles = findFiles(APP_DIR, '_meta.js')
console.log(`\nFound ${metaFiles.length} _meta.js files`)

for (const metaPath of metaFiles) {
  const relPath = path.relative(APP_DIR, metaPath)
  const dest = path.join(CONTENT_DIR, relPath)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(metaPath, dest)
  console.log(`  ${metaPath} → ${dest}`)
}

// 3. Clean up app/ — remove page.mdx and _meta.js files, empty dirs
console.log('\nCleaning app/ directory...')
for (const f of [...mdxFiles, ...metaFiles]) {
  fs.unlinkSync(f)
}

// Remove empty directories (bottom-up)
function removeEmptyDirs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name)
      removeEmptyDirs(subDir)
      try {
        const remaining = fs.readdirSync(subDir)
        if (remaining.length === 0) {
          fs.rmdirSync(subDir)
        }
      } catch {}
    }
  }
}
removeEmptyDirs(APP_DIR)

console.log('\n✓ Migration complete!')
console.log(`  Content: ${CONTENT_DIR}/`)
console.log(`  MDX files: ${mdxFiles.length}`)
console.log(`  Meta files: ${metaFiles.length}`)
