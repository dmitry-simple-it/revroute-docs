// Precomputes the dotted world map + city pin coordinates so the client
// doesn't need to bundle `dotted-map` (which includes country polygons).
// Run: node scripts/build-world-map.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import DottedMap from 'dotted-map'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const cities = [
  { lat: 55.7558, lng: 37.6173, label: 'Москва' },
  { lat: 59.9343, lng: 30.3351, label: 'СПб' },
  { lat: 55.0084, lng: 82.9357, label: 'Новосибирск' },
  { lat: 43.2389, lng: 76.8897, label: 'Алматы' },
  { lat: 25.2048, lng: 55.2708, label: 'Дубай' },
  { lat: 52.52, lng: 13.405, label: 'Берлин' },
  { lat: 51.5074, lng: -0.1278, label: 'Лондон' },
  { lat: 41.0082, lng: 28.9784, label: 'Стамбул' },
  { lat: 35.6762, lng: 139.6503, label: 'Токио' },
  { lat: 1.3521, lng: 103.8198, label: 'Сингапур' },
  { lat: -33.8688, lng: 151.2093, label: 'Сидней' },
  { lat: 28.6139, lng: 77.209, label: 'Нью-Дели' },
  { lat: 31.2304, lng: 121.4737, label: 'Шанхай' },
  { lat: 40.4168, lng: -3.7038, label: 'Мадрид' },
  { lat: 37.5665, lng: 126.978, label: 'Сеул' },
  { lat: -33.9249, lng: 18.4241, label: 'Кейптаун' },
  { lat: 30.0444, lng: 31.2357, label: 'Каир' },
  { lat: 6.5244, lng: 3.3792, label: 'Лагос' },
  { lat: 48.8566, lng: 2.3522, label: 'Париж' },
  { lat: 56.8389, lng: 60.6057, label: 'Екатеринбург' },
  { lat: 40.7128, lng: -74.006, label: 'Нью-Йорк' },
  { lat: 34.0522, lng: -118.2437, label: 'Лос-Анджелес' },
  { lat: -23.5505, lng: -46.6333, label: 'Сан-Паулу' },
  { lat: 19.4326, lng: -99.1332, label: 'Мехико' },
  { lat: 43.6532, lng: -79.3832, label: 'Торонто' },
]

const map = new DottedMap({ height: 60, grid: 'diagonal' })
const points = map.getPoints()

const pins = cities.map((c) => {
  const p = map.addPin({ lat: c.lat, lng: c.lng })
  return { x: p.x, y: p.y, label: c.label }
})

const output = {
  image: map.image,
  points: points.map((p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2) })),
  pins: pins.map((p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), label: p.label })),
}

const outPath = path.join(__dirname, '..', 'components/marketing/shared/world-map.json')
fs.writeFileSync(outPath, JSON.stringify(output))
console.log(`wrote ${outPath} — ${output.points.length} points, ${output.pins.length} pins`)
