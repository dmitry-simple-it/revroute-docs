# Демо встроенного кабинета партнёра

Живая страница: https://simple-it.pro/demo/revroute-cabinet/ — условный сайт вендора «CloudFlow»
(демо-пространство `cloudflow-demo`), после «входа» в нём открывается встроенный кабинет демо-партнёра
«ТехноБлог» через `@revroute/embed-core`. На неё ссылается страница
`content/ru/docs/partners/embedded-referrals.mdx`, раздел «Как это выглядит».

- `index.html` — страница, кладётся в `/var/www/revroute-cabinet-demo/` на simple-it.pro (95.163.222.31).
- `nginx-locations.conf` — кладётся в `/etc/nginx/snippets/revroute-cabinet-demo.conf`, подключается
  в server-блок simple-it.pro в `/etc/nginx/sites-enabled/default`. Адрес `./token` выдаёт публичный
  токен (живёт 3 часа): nginx делает `POST /api/tokens/embed/referrals` с ключом демо-пространства.
- Ключ — `/etc/nginx/revroute-cabinet-demo-key.conf` на сервере, в репозитории его нет. Ключ
  демо-пространства `cloudflow-demo`, тип «Системный», права «Ограниченный» → «Ссылки: запись»
  (больше роуту выдачи токена не нужно).
- Лимит: `limit_req_zone $binary_remote_addr zone=rrcabinet:1m rate=10r/m;` в
  `/etc/nginx/conf.d/revroute-cabinet-demo-limit.conf`.

Сервер simple-it.pro слабый: SSH-команды — последовательно, одним соединением.
