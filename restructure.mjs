/**
 * Restructure help articles from flat help/article/ into grouped subdirectories
 * based on docs.json navigation, so Nextra creates collapsible sidebar groups.
 */

import fs from 'fs'
import path from 'path'

const SRC = '../dub-docs-mintlify'
const APP = './app'

const docsJson = JSON.parse(fs.readFileSync(path.join(SRC, 'docs.json'), 'utf-8'))

// Find Help Center tab
const helpTab = docsJson.navigation.tabs.find(t => t.tab === 'Help Center')

function slugify(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function extractTitle(filePath) {
  if (!fs.existsSync(filePath)) return null
  const content = fs.readFileSync(filePath, 'utf-8')
  const m = content.match(/sidebarTitle:\s*["']?(.*?)["']?\s*$/m)
    || content.match(/title:\s*["']?(.*?)["']?\s*$/m)
  return m ? m[1] : null
}

// First, clean out old help/article structure
const oldArticleDir = path.join(APP, 'help', 'article')

// Collect all existing article files before restructuring
const existingArticles = new Map()
if (fs.existsSync(oldArticleDir)) {
  for (const entry of fs.readdirSync(oldArticleDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const pagePath = path.join(oldArticleDir, entry.name, 'page.mdx')
      if (fs.existsSync(pagePath)) {
        existingArticles.set(entry.name, fs.readFileSync(pagePath, 'utf-8'))
      }
    }
  }
}
console.log(`Found ${existingArticles.size} existing articles`)

// Remove old article directory
fs.rmSync(oldArticleDir, { recursive: true, force: true })

// Process Help Center groups
function processGroup(group, parentDir, metaEntries) {
  if (group.group && group.group.trim() === '') return // Skip empty group (root "help" page)

  const pages = group.pages || []

  for (const page of pages) {
    if (typeof page === 'string') {
      // Direct page reference
      const slug = page.split('/').pop()

      // Skip non-help articles (like docs/partners/embedded-referrals)
      if (!page.startsWith('help/')) continue

      const destDir = path.join(parentDir, slug)
      fs.mkdirSync(destDir, { recursive: true })

      if (existingArticles.has(slug)) {
        fs.writeFileSync(path.join(destDir, 'page.mdx'), existingArticles.get(slug))
        const title = extractTitle(path.join(destDir, 'page.mdx'))
        metaEntries[slug] = title || slug
      } else {
        console.warn(`  MISSING: ${slug}`)
      }
    } else if (typeof page === 'object' && page.group) {
      // Nested group — create a subdirectory
      const groupSlug = slugify(page.group)
      const groupDir = path.join(parentDir, groupSlug)
      fs.mkdirSync(groupDir, { recursive: true })

      const subMeta = {}
      processGroup(page, groupDir, subMeta)

      // Write _meta.js for this subgroup
      if (Object.keys(subMeta).length > 0) {
        fs.writeFileSync(
          path.join(groupDir, '_meta.js'),
          `export default ${JSON.stringify(subMeta, null, 2)}\n`
        )
      }

      // Add group to parent meta
      metaEntries[groupSlug] = page.group
    }
  }
}

// Process each top-level group in Help Center
const helpDir = path.join(APP, 'help')
const helpMeta = { index: 'Help Center' }

for (const group of helpTab.groups) {
  if (group.group && group.group.trim() === '') continue // Skip root

  const groupName = group.group
  const groupSlug = slugify(groupName)
  const groupDir = path.join(helpDir, groupSlug)
  fs.mkdirSync(groupDir, { recursive: true })

  const groupMeta = {}

  // Process pages in this top-level group
  for (const page of group.pages) {
    if (typeof page === 'string') {
      const slug = page.split('/').pop()
      if (!page.startsWith('help/')) continue
      const destDir = path.join(groupDir, slug)
      fs.mkdirSync(destDir, { recursive: true })
      if (existingArticles.has(slug)) {
        fs.writeFileSync(path.join(destDir, 'page.mdx'), existingArticles.get(slug))
        const title = extractTitle(path.join(destDir, 'page.mdx'))
        groupMeta[slug] = title || slug
      } else {
        console.warn(`  MISSING: ${slug}`)
      }
    } else if (typeof page === 'object' && page.group) {
      const subGroupSlug = slugify(page.group)
      const subGroupDir = path.join(groupDir, subGroupSlug)
      fs.mkdirSync(subGroupDir, { recursive: true })

      const subMeta = {}

      for (const subPage of (page.pages || [])) {
        if (typeof subPage === 'string') {
          const slug = subPage.split('/').pop()
          if (!subPage.startsWith('help/')) continue
          const destDir = path.join(subGroupDir, slug)
          fs.mkdirSync(destDir, { recursive: true })
          if (existingArticles.has(slug)) {
            fs.writeFileSync(path.join(destDir, 'page.mdx'), existingArticles.get(slug))
            const title = extractTitle(path.join(destDir, 'page.mdx'))
            subMeta[slug] = title || slug
          } else {
            console.warn(`  MISSING: ${slug}`)
          }
        } else if (typeof subPage === 'object' && subPage.group) {
          // 3rd level nesting (e.g. "Filtering analytics")
          const subSubSlug = slugify(subPage.group)
          const subSubDir = path.join(subGroupDir, subSubSlug)
          fs.mkdirSync(subSubDir, { recursive: true })

          const subSubMeta = {}
          for (const ssPage of (subPage.pages || [])) {
            if (typeof ssPage === 'string') {
              const slug = ssPage.split('/').pop()
              if (!ssPage.startsWith('help/')) continue
              const destDir = path.join(subSubDir, slug)
              fs.mkdirSync(destDir, { recursive: true })
              if (existingArticles.has(slug)) {
                fs.writeFileSync(path.join(destDir, 'page.mdx'), existingArticles.get(slug))
                const title = extractTitle(path.join(destDir, 'page.mdx'))
                subSubMeta[slug] = title || slug
              }
            }
          }
          if (Object.keys(subSubMeta).length > 0) {
            fs.writeFileSync(path.join(subSubDir, '_meta.js'), `export default ${JSON.stringify(subSubMeta, null, 2)}\n`)
          }
          subMeta[subSubSlug] = subPage.group
        }
      }

      if (Object.keys(subMeta).length > 0) {
        fs.writeFileSync(path.join(subGroupDir, '_meta.js'), `export default ${JSON.stringify(subMeta, null, 2)}\n`)
      }
      groupMeta[subGroupSlug] = page.group
    }
  }

  // Write _meta.js for this top-level group
  if (Object.keys(groupMeta).length > 0) {
    fs.writeFileSync(
      path.join(groupDir, '_meta.js'),
      `export default ${JSON.stringify(groupMeta, null, 2)}\n`
    )
  }

  helpMeta[groupSlug] = groupName
}

// Write help/_meta.js
fs.writeFileSync(
  path.join(helpDir, '_meta.js'),
  `export default ${JSON.stringify(helpMeta, null, 2)}\n`
)

console.log('\nGenerated structure:')
console.log(JSON.stringify(helpMeta, null, 2))
console.log('\n✓ Restructuring complete!')
