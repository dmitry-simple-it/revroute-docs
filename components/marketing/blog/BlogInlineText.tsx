import type { BlogInline } from '@/lib/dzen/types'
import { absoluteUrl } from '@/lib/dzen/rss'

export function BlogInlineText({ nodes }: { nodes: BlogInline[] }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text': return <span key={index}>{node.text}</span>
      case 'bold': return <strong key={index}><BlogInlineText nodes={node.children} /></strong>
      case 'italic': return <em key={index}><BlogInlineText nodes={node.children} /></em>
      case 'link': return <a key={index} href={absoluteUrl(node.href)} className="underline underline-offset-2"><BlogInlineText nodes={node.children} /></a>
    }
  })
}
