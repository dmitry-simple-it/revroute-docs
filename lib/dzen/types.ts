export type DzenImage = {
  url: string
  type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
  length: number
  width: number
  height: number
}

export type BlogInline =
  | { type: 'text'; text: string }
  | { type: 'bold' | 'italic'; children: BlogInline[] }
  | { type: 'link'; href: string; children: BlogInline[] }

export type DzenPublication = {
  /** Explicit editorial opt-in. Omitted/false means no export. */
  enabled: boolean
  /** Default is a Dzen draft; publish must be chosen explicitly. */
  mode?: 'draft' | 'publish'
  cover: DzenImage
  /** Original publication time, not the time of the latest edit. */
  publishedAt?: string
  /** Keep this unchanged when editing the post or its slug. */
  guid?: string
}
