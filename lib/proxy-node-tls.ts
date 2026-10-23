import type { PeerCertificate } from 'node:tls'

/**
 * TLS до прокси-ноды вне РФ (162.248.165.209:8446 — Telegram Bot API).
 *
 * У прокси самоподписанный сертификат без IP в SAN, поэтому штатная проверка
 * имени на нём не проходит. До 23.10.2026 проверку выключали целиком
 * (`rejectUnauthorized: false`): посредник между сервером и нодой мог прочитать
 * токен бота и секрет прокси. Теперь доверяем ровно этому сертификату: цепочка
 * проверяется против него одного (`ca`), вместо имени сверяется отпечаток.
 *
 * Копия из основного репо (`apps/web/lib/proxy-node/tls.ts`), источник истины и
 * порядок ротации — `ops/proxy-node/` там же.
 */
export const PROXY_NODE_CERT = `-----BEGIN CERTIFICATE-----
MIIDFTCCAf2gAwIBAgIUIhbW+XPU+rhEsJ2OQuoXWCkeSIowDQYJKoZIhvcNAQEL
BQAwGjEYMBYGA1UEAwwPYW50aHJvcGljLXByb3h5MB4XDTI2MDIwODE2NDMzOFoX
DTM2MDIwNjE2NDMzOFowGjEYMBYGA1UEAwwPYW50aHJvcGljLXByb3h5MIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5yiTC/c5/IaXmoY9y7xDukUUqgH+
W68yqjuKnaA46UzGzVtatjQmfh91eEG6YwM77Xc+kphRfoLTB9Xn2/pWr9SAjyLc
418jSuSjsfMtGaBX1kbLotXytPL/DtTnrzdpcPMymWCXrK6+1Puln5t/b7Osf+vy
ZDkOFxzUA/xPxHTY4ZL35sZ/bsG4qKcMU5rhVXiqxdbAyOOK/hGT2ITn2ZhiTg6l
LWNFEVFB7CEjKNi37VvX4ZSHK0yWTyFQyc9NeXM49yiv9ZLhX3hzPmmtiV62vopF
HS6G+OXjuYYNSGE0v3s7fTcyRaMcje/LvbQWVeNmG3IvYeexQNSameNxSwIDAQAB
o1MwUTAdBgNVHQ4EFgQU65qhW8Cf6MRGNFddkno7vJE9LlMwHwYDVR0jBBgwFoAU
65qhW8Cf6MRGNFddkno7vJE9LlMwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0B
AQsFAAOCAQEAVR/XRjGkJqVbjXcB5QzWdF41DQJTpt2AKheujbfxII/gnZT2whhs
QiPAzn55u4t25nO8qaQD28mjflQeIenVVT9ILmcB7FZq/yiRnYFOEu9CbpkZEMH+
P5ogbJ748l7Z3ZEHCHLPtVyBpA9E/ytKNESYNTDvj6UnQzE9KxwmEf8a91dhemm7
9MSTj77y+qqEsxiGTDuWnQOChrHeY0JGlnE8G2jyaHIobYg8/sKJu3ZAiYualJwI
hbErYzp3v4xEq1gYliXS9GW3Gqa9WIqlAMeIcHSGL3zt9yhNTPoNORqlCn3O211L
3ysFxpRnM9GBpC+pSqMo0bvs2y09ub8zzA==
-----END CERTIFICATE-----
`

export const PROXY_NODE_FINGERPRINT256 =
  '6D:1A:D8:F3:54:BE:48:85:D3:40:BE:F2:C8:FB:AD:00:DE:02:C6:CE:36:38:6F:E7:15:FD:E0:3B:3A:39:11:0E'

/** Опции TLS для `https.request` к прокси-ноде. */
export const proxyNodeTls = {
  ca: PROXY_NODE_CERT,
  checkServerIdentity: (_host: string, cert: PeerCertificate): Error | undefined =>
    cert.fingerprint256 === PROXY_NODE_FINGERPRINT256
      ? undefined
      : new Error(`сертификат прокси-ноды не совпадает с пином: ${cert.fingerprint256}`),
}
