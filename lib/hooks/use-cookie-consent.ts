'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'revroute_cookie_consent'
const TTL_MS = 365 * 24 * 60 * 60 * 1000 // 12 месяцев
const CHANGE_EVENT = 'revroute-cookie-consent-change'

export type ConsentValue = 'accepted' | 'rejected'

type StoredConsent = {
  value: ConsentValue
  expires: number
}

function readStoredConsent(): ConsentValue | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as StoredConsent
    if (!parsed.expires || Date.now() > parsed.expires) {
      window.localStorage.removeItem(STORAGE_KEY)
      return undefined
    }
    if (parsed.value !== 'accepted' && parsed.value !== 'rejected') {
      return undefined
    }
    return parsed.value
  } catch {
    return undefined
  }
}

function writeStoredConsent(value: ConsentValue | undefined) {
  if (typeof window === 'undefined') return
  if (value === undefined) {
    window.localStorage.removeItem(STORAGE_KEY)
  } else {
    const stored: StoredConsent = { value, expires: Date.now() + TTL_MS }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | undefined>(undefined)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConsent(readStoredConsent())
    setHydrated(true)

    const sync = () => setConsent(readStoredConsent())
    window.addEventListener('storage', sync)
    window.addEventListener(CHANGE_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(CHANGE_EVENT, sync)
    }
  }, [])

  return {
    consent,
    hydrated,
    accept: () => writeStoredConsent('accepted'),
    reject: () => writeStoredConsent('rejected'),
    reset: () => writeStoredConsent(undefined),
  }
}
