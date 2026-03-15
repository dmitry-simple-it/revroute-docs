/**
 * Fix internal links in MDX files: /help/article/{slug} -> new paths
 * Also generates redirect map for middleware
 */

import fs from 'fs'
import path from 'path'

const CONTENT_DIR = './content/en'

// Build slug -> new path mapping
function buildMapping() {
  const mapping = {}

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') {
        const rel = path.relative(CONTENT_DIR, fullPath)
        const route = '/' + rel.replace(/\.mdx$/, '')
        const slug = path.basename(rel, '.mdx')
        mapping[slug] = route
      }
    }
  }

  walk(path.join(CONTENT_DIR, 'help'))
  return mapping
}

const mapping = buildMapping()
console.log(`Built mapping: ${Object.keys(mapping).length} slugs`)

// Fix links in all MDX files (both en and ru)
function fixLinks(dir) {
  let filesFixed = 0
  let linksFixed = 0

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const fullPath = path.join(d, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.mdx')) {
        let content = fs.readFileSync(fullPath, 'utf-8')
        let changed = false

        // Replace /help/article/{slug} with new path
        const newContent = content.replace(
          /\/help\/article\/([a-z0-9-]+)/g,
          (match, slug) => {
            if (mapping[slug]) {
              linksFixed++
              changed = true
              return mapping[slug]
            }
            return match // keep if no mapping found
          }
        )

        if (changed) {
          fs.writeFileSync(fullPath, newContent)
          filesFixed++
        }
      }
    }
  }

  walk(dir)
  return { filesFixed, linksFixed }
}

// Fix in both en and ru
const enResult = fixLinks('./content/en')
console.log(`EN: Fixed ${enResult.linksFixed} links in ${enResult.filesFixed} files`)

const ruResult = fixLinks('./content/ru')
console.log(`RU: Fixed ${ruResult.linksFixed} links in ${ruResult.filesFixed} files`)

// Generate redirect map for middleware
const redirects = {}
for (const [slug, newPath] of Object.entries(mapping)) {
  redirects[`/help/article/${slug}`] = newPath
}

// Also add common old paths
redirects['/help/article/what-is-a-workspace'] = mapping['what-is-a-workspace'] || '/help/managing-your-workspace/what-is-a-workspace'

fs.writeFileSync('./redirects.json', JSON.stringify(redirects, null, 2))
console.log(`\nGenerated redirects.json with ${Object.keys(redirects).length} redirects`)
console.log('Done!')
