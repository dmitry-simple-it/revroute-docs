export type PartnerLeaderboardRow = {
  name: string
  handle: string
  flag: string
  initials: string
  bg: string
  clicks: number
  sales: string
  payout: string
  data: number[]
}

export const partnersLeaderboard: PartnerLeaderboardRow[] = [
  { name: 'Сергей Иванов', handle: '@sergio_marketer', flag: '🇷🇺', initials: 'СИ', bg: '#3b82f6', clicks: 18240, sales: '584 200 ₽', payout: '175 260 ₽', data: [12, 14, 18, 20, 26, 34, 30, 42, 48, 52, 60, 68] },
  { name: 'Мария Козлова', handle: '@masha_affiliate', flag: '🇧🇾', initials: 'МК', bg: '#8b5cf6', clicks: 12480, sales: '312 800 ₽', payout: '93 840 ₽', data: [8, 10, 12, 11, 14, 16, 22, 20, 28, 32, 38, 42] },
  { name: 'Aleksey Petrov', handle: '@alex.growth', flag: '🇰🇿', initials: 'АП', bg: '#ec4899', clicks: 9620, sales: '248 400 ₽', payout: '74 520 ₽', data: [6, 8, 9, 11, 10, 14, 16, 18, 22, 26, 28, 32] },
  { name: 'Darya Volkova', handle: '@darya_content', flag: '🇷🇺', initials: 'ДВ', bg: '#f97316', clicks: 7820, sales: '184 900 ₽', payout: '55 470 ₽', data: [4, 6, 7, 9, 8, 12, 10, 14, 18, 20, 22, 26] },
  { name: 'Nikita Sokolov', handle: '@nik_ads', flag: '🇩🇪', initials: 'НС', bg: '#14b8a6', clicks: 5480, sales: '124 600 ₽', payout: '37 380 ₽', data: [3, 4, 5, 6, 8, 7, 9, 11, 13, 14, 17, 19] },
]
