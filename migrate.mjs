/**
 * Migration script: converts Mintlify docs structure to Nextra v4 App Router format
 *
 * 1. Reads docs.json navigation
 * 2. Copies MDX files into app/ directory (each as page.mdx)
 * 3. Generates _meta.js files for sidebar navigation
 * 4. Strips/converts Mintlify frontmatter
 */

import fs from 'fs'
import path from 'path'

const SRC = '../dub-docs-mintlify'
const DEST = './app'

const docsJson = JSON.parse(fs.readFileSync(path.join(SRC, 'docs.json'), 'utf-8'))

// --- Copy MDX content ---

function copyMdxFile(srcRelative, destDir) {
  // srcRelative like "docs/quickstart/server" or "help/article/foo"
  const srcFile = path.join(SRC, srcRelative + '.mdx')
  if (!fs.existsSync(srcFile)) {
    console.warn(`  SKIP (not found): ${srcFile}`)
    return false
  }

  let content = fs.readFileSync(srcFile, 'utf-8')

  // Strip Mintlify openapi frontmatter field (not supported)
  content = content.replace(/^---\n([\s\S]*?)\n---/, (match, fm) => {
    const lines = fm.split('\n').filter(l => !l.startsWith('openapi:'))
    return `---\n${lines.join('\n')}\n---`
  })

  // Convert snippet imports from "/snippets/..." to relative paths
  content = content.replace(
    /from\s+["']\/snippets\/(.*?)["']/g,
    (match, snippetPath) => `from "@/snippets/${snippetPath}"`
  )

  fs.mkdirSync(destDir, { recursive: true })
  fs.writeFileSync(path.join(destDir, 'page.mdx'), content)
  return true
}

// --- Generate _meta.js ---

function extractTitle(srcRelative) {
  const srcFile = path.join(SRC, srcRelative + '.mdx')
  if (!fs.existsSync(srcFile)) return slugToTitle(srcRelative.split('/').pop())
  const content = fs.readFileSync(srcFile, 'utf-8')
  const match = content.match(/sidebarTitle:\s*["']?(.*?)["']?\s*$/m)
    || content.match(/title:\s*["']?(.*?)["']?\s*$/m)
  return match ? match[1] : slugToTitle(srcRelative.split('/').pop())
}

function slugToTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function processPages(pages, parentDir) {
  const meta = {}

  for (const page of pages) {
    if (typeof page === 'string') {
      // Simple page reference like "docs/quickstart/server"
      const parts = page.split('/')
      const slug = parts[parts.length - 1]
      const destDir = path.join(DEST, ...parts)

      // If the page path equals just the tab root (e.g. "docs" or "help"), treat as index
      if (parts.length === 1) {
        // Root page like "help" or "docs"
        copyMdxFile(page, path.join(DEST, page))
        meta['index'] = extractTitle(page)
      } else {
        // Figure out the relative slug from parentDir
        const relParts = path.relative(parentDir, destDir).split(path.sep)
        const relSlug = relParts.join('/')

        copyMdxFile(page, destDir)

        if (relParts.length === 1) {
          meta[slug] = extractTitle(page)
        }
        // Deeper nesting is handled by recursive groups
      }
    } else if (typeof page === 'object' && page.group) {
      // Nested group
      const groupSlug = page.group.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      // Check if pages in this group share a common prefix we can use as directory
      if (page.pages && page.pages.length > 0) {
        const firstPage = typeof page.pages[0] === 'string' ? page.pages[0] : null

        if (firstPage) {
          // Find common directory for group pages
          const pagePaths = page.pages.filter(p => typeof p === 'string')
          if (pagePaths.length > 0) {
            const commonParts = pagePaths[0].split('/')
            // Process each page in the group
            for (const subPage of page.pages) {
              if (typeof subPage === 'string') {
                const parts = subPage.split('/')
                const slug = parts[parts.length - 1]
                const destDir = path.join(DEST, ...parts)
                copyMdxFile(subPage, destDir)
              } else if (typeof subPage === 'object' && subPage.group) {
                // Recursive nested group
                processPages([subPage], parentDir)
              }
            }
          }
        }
      }

      // Add separator for group title
      const sepKey = `--- ${groupSlug}`
      meta[sepKey] = { type: 'separator', title: page.group }
    }
  }

  return meta
}

// --- Process each tab ---

const tabs = docsJson.navigation.tabs

// Build top-level _meta.js
const topMeta = {
  index: { title: 'Home', type: 'page' },
}

for (const tab of tabs) {
  const tabSlug = tab.tab.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Map tab names to directory names based on content
  let dirName
  if (tab.tab === 'Developer Docs') dirName = 'docs'
  else if (tab.tab === 'Help Center') dirName = 'help'
  else if (tab.tab === 'API Reference') dirName = 'api-reference'
  else if (tab.tab === 'Webhooks') dirName = 'webhooks'
  else dirName = tabSlug

  topMeta[dirName] = { title: tab.tab, type: 'page' }
}

// --- Now process content for each tab ---

// Process all tabs and copy their MDX files
for (const tab of tabs) {
  let dirName
  if (tab.tab === 'Developer Docs') dirName = 'docs'
  else if (tab.tab === 'Help Center') dirName = 'help'
  else if (tab.tab === 'API Reference') dirName = 'api-reference'
  else if (tab.tab === 'Webhooks') dirName = 'webhooks'
  else dirName = tab.tab.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  console.log(`\n=== Processing tab: ${tab.tab} → ${dirName}/ ===`)

  // Collect all page paths from all groups
  function collectAllPages(groups) {
    const allPages = []
    for (const group of groups) {
      if (group.pages) {
        for (const page of group.pages) {
          if (typeof page === 'string') {
            allPages.push(page)
          } else if (page.group && page.pages) {
            // Recursively collect from nested groups
            allPages.push(...collectAllPagesFlat(page.pages))
          }
        }
      }
    }
    return allPages
  }

  function collectAllPagesFlat(pages) {
    const result = []
    for (const page of pages) {
      if (typeof page === 'string') {
        result.push(page)
      } else if (page.group && page.pages) {
        result.push(...collectAllPagesFlat(page.pages))
      }
    }
    return result
  }

  const allPages = collectAllPages(tab.groups || [])
  console.log(`  Found ${allPages.length} pages`)

  for (const pagePath of allPages) {
    const parts = pagePath.split('/')
    const destDir = path.join(DEST, ...parts)
    copyMdxFile(pagePath, destDir)
  }
}

// --- Generate _meta.js files by scanning what was copied ---

function generateMetaForDir(dir, srcPrefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const meta = {}

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name)
      const hasPage = fs.existsSync(path.join(subDir, 'page.mdx'))

      if (hasPage) {
        // Extract title from the MDX file
        const content = fs.readFileSync(path.join(subDir, 'page.mdx'), 'utf-8')
        const titleMatch = content.match(/sidebarTitle:\s*["']?(.*?)["']?\s*$/m)
          || content.match(/title:\s*["']?(.*?)["']?\s*$/m)
        meta[entry.name] = titleMatch ? titleMatch[1] : slugToTitle(entry.name)
      }

      // Check if directory has subdirectories (recurse)
      const subEntries = fs.readdirSync(subDir, { withFileTypes: true })
      const hasSubDirs = subEntries.some(e => e.isDirectory())
      if (hasSubDirs) {
        generateMetaForDir(subDir, srcPrefix + '/' + entry.name)
      }
    }
  }

  if (Object.keys(meta).length > 0) {
    const metaContent = `export default ${JSON.stringify(meta, null, 2)}\n`
    fs.writeFileSync(path.join(dir, '_meta.js'), metaContent)
    console.log(`  Generated: ${path.relative(DEST, dir)}/_meta.js (${Object.keys(meta).length} entries)`)
  }
}

// Write top-level _meta.js
fs.writeFileSync(
  path.join(DEST, '_meta.js'),
  `export default ${JSON.stringify(topMeta, null, 2)}\n`
)
console.log(`\nGenerated: _meta.js (top-level)`)

// Generate _meta.js for each directory
for (const dirName of ['docs', 'help']) {
  const dirPath = path.join(DEST, dirName)
  if (fs.existsSync(dirPath)) {
    generateMetaForDir(dirPath, dirName)
  }
}

// --- Copy static assets ---
const assetDirs = ['images', 'logos', 'fonts']
for (const assetDir of assetDirs) {
  const src = path.join(SRC, assetDir)
  const dest = path.join('./public', assetDir)
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true })
    console.log(`Copied: ${assetDir}/ → public/${assetDir}/`)
  }
}

// --- Copy snippets ---
const snippetsSrc = path.join(SRC, 'snippets')
const snippetsDest = './snippets'
if (fs.existsSync(snippetsSrc)) {
  fs.cpSync(snippetsSrc, snippetsDest, { recursive: true })
  console.log(`Copied: snippets/`)
}

console.log('\n✓ Migration complete!')
console.log(`  Run "npm run dev" to start the dev server`)
