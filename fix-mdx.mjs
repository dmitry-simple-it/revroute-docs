/**
 * Fix MDX files for Nextra compatibility
 */

import fs from 'fs'
import path from 'path'

function fixMdxContent(content, filePath) {
  // Fix frontmatter: remove quoted keys like "og:title"
  content = content.replace(/^---\n([\s\S]*?)\n---/, (match, fm) => {
    const lines = fm.split('\n').filter(l => {
      return !l.match(/^"[^"]*:/)
    })
    return `---\n${lines.join('\n')}\n---`
  })

  // Convert <img .../> tags to markdown ![alt](src)
  content = content.replace(
    /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']*?)["'][^>]*?\/?>/g,
    '![$2]($1)'
  )
  content = content.replace(
    /<img\s+[^>]*?alt=["']([^"']*?)["'][^>]*?src=["']([^"']+)["'][^>]*?\/?>/g,
    '![$1]($2)'
  )
  content = content.replace(
    /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?\/?>/g,
    '![]($1)'
  )

  // Unwrap <Frame>...</Frame> — just keep the content inside
  // This avoids Nextra's figure rehype plugin conflict
  content = content.replace(
    /<Frame[^>]*>\s*([\s\S]*?)\s*<\/Frame>/g,
    (match, inner) => inner.trim()
  )

  // Fix icon prop with inline image
  content = content.replace(
    /icon=\{[\s\S]*?!\[([^\]]*)\]\([^)]+\)[\s\S]*?\}/g,
    ''
  )

  // Fix icon prop with inline SVG
  content = content.replace(
    /icon=\{\s*<svg[\s\S]*?<\/svg>\s*\}/g,
    ''
  )

  // Remove import statements that reference /snippets/
  content = content.replace(
    /^import\s+.*?from\s+["'](?:@\/snippets|\/snippets)\/.*?["'];?\s*$/gm,
    ''
  )

  // Fix self-closing video tags
  content = content.replace(
    /<video\s+([^>]*?)\/>/g,
    '<video $1></video>'
  )

  // Fix <br> tags
  content = content.replace(/<br\s*>/g, '<br />')

  // Remove empty icon=""
  content = content.replace(/\s+icon=""\s*/g, ' ')

  // Remove empty lines left from removed imports (3+ consecutive newlines → 2)
  content = content.replace(/\n{3,}/g, '\n\n')

  return content
}

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let fixed = 0

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      fixed += processDir(fullPath)
    } else if (entry.name === 'page.mdx') {
      const original = fs.readFileSync(fullPath, 'utf-8')
      const updated = fixMdxContent(original, fullPath)
      if (original !== updated) {
        fs.writeFileSync(fullPath, updated)
        fixed++
      }
    }
  }

  return fixed
}

const count = processDir('./app')
console.log(`Fixed ${count} MDX files`)
