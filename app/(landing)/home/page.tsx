import { permanentRedirect } from 'next/navigation'

/** Лендинг переехал с /home на корень / (решение владельца 16.07.2026). */
export default function HomeRedirect() {
  permanentRedirect('/')
}
