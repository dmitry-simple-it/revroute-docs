export interface Integration {
  slug: string
  name: string
  category: string
  categoryRu: string
  description: string
  builtBy: string
  website: string
  websiteUrl: string
  iconLetters: string
  iconColor: string
  detailedDescription?: string
  features?: { title: string; text: string }[]
  isComingSoon?: boolean
  isGuide?: boolean
  guideUrl?: string
  /**
   * Техническая инструкция «как подключить» в документации.
   *
   * Роли разведены намеренно: каталог `/integrations/*` — витрина «что с чем
   * работает» для выбора, `/{locale}/docs/integrations/*` — пошаговая настройка.
   * Пока обе стороны описывали одно и то же, они конкурировали за один запрос;
   * теперь витрина ссылается на инструкцию, а инструкция — обратно на витрину.
   *
   * Путь с префиксом локали: маркетинг у нас только русский (см. CLAUDE.md),
   * поэтому ведём на `/ru/docs/...`.
   */
  docsUrl?: string
  /**
   * Витринная заглушка, а не реальная интеграция (пример OAuth-приложения).
   * Такие записи не попадают в sitemap: тонкая страница с несуществующим
   * брендом портит качественные сигналы каталога и может всплыть в ИИ-ответе
   * как настоящая интеграция.
   */
  isDemo?: boolean
}

export const integrations: Integration[] = [
  {
    slug: 'yookassa',
    name: 'ЮKassa',
    category: 'payments',
    categoryRu: 'Платежи',
    description: 'Подписки RevRoute и выплаты партнёрам в рублях через ЮKassa.',
    detailedDescription:
      'ЮKassa закрывает в RevRoute обе стороны денежного потока: подписку workspace на платформу и выплаты партнёрам. Карта сохраняется через виджет ЮKassa и привязывается к workspace, а выплаты уходят через ЮKassa Payouts с подтверждением по вебхукам.',
    builtBy: 'RevRoute',
    website: 'yookassa.ru',
    websiteUrl: 'https://yookassa.ru',
    iconLetters: 'Yk',
    iconColor: '#0088ff',
    features: [
      {
        title: 'Подписка на платформу',
        text: 'При первой оплате карта токенизируется в виджете ЮKassa и привязывается к workspace. Последующие списания по подписке проходят по сохранённому токену автоматически.',
      },
      {
        title: 'Выплаты партнёрам',
        text: 'Массовые выплаты через ЮKassa Payouts с рублёвого баланса workspace. Статус каждой выплаты подтверждается вебхуками payout.succeeded и payout.canceled.',
      },
      {
        title: 'Атрибуция продаж',
        text: 'В событии продажи можно передать paymentProcessor: "yookassa" — оплата связывается с исходным кликом и партнёром, а комиссия рассчитывается по правилам программы.',
      },
    ],
  },
  {
    slug: 'shopify',
    name: 'Shopify',
    category: 'payments',
    categoryRu: 'Платежи',
    // Витрина отвечает на «что даёт связка», пошаговая настройка — в доках
    // (`docsUrl`). Раньше оба описания говорили одно и то же и конкурировали
    // за один и тот же запрос.
    description:
      'Заказы магазина Shopify попадают в отчёты RevRoute как продажи — с привязкой к ссылке и партнёру.',
    detailedDescription:
      'Связка RevRoute и Shopify показывает, какие ссылки и партнёры приносят заказы: оплаченный заказ становится продажей в отчётах вместе с суммой, а по клиентам считаются CAC и LTV.',
    builtBy: 'RevRoute',
    website: 'apps.shopify.com',
    websiteUrl: 'https://apps.shopify.com',
    docsUrl: '/ru/docs/integrations',
    iconLetters: 'Sh',
    iconColor: '#96bf48',
    features: [
      {
        title: 'Аналитика конверсий в реальном времени',
        text: 'Отслеживайте, как короткие ссылки RevRoute генерируют продажи в вашем Shopify-магазине. Получайте данные о конверсиях мгновенно.',
      },
      {
        title: 'Аналитика клиентов (CAC/LTV)',
        text: 'Рассчитывайте стоимость привлечения клиента и пожизненную ценность, чтобы оптимизировать маркетинговые каналы.',
      },
      {
        title: 'AI-аналитика',
        text: 'Используйте AI-инструменты для автоматического выявления трендов и возможностей роста на основе данных о конверсиях.',
      },
    ],
  },
  {
    slug: 'zapier',
    name: 'Zapier',
    category: 'automation',
    categoryRu: 'Автоматизация',
    description: 'Связка RevRoute с 7 000+ приложениями через Zapier — на вебхуках и открытом API.',
    detailedDescription:
      'Готового приложения RevRoute в каталоге Zapier пока нет. Связка собирается на стандартных модулях Zapier: события RevRoute приходят вебхуком, а действия в RevRoute выполняются запросами к открытому API.',
    builtBy: 'Zapier',
    website: 'zapier.com',
    websiteUrl: 'https://zapier.com',
    iconLetters: 'Za',
    iconColor: '#ff4a00',
    docsUrl: '/ru/docs/webhooks',
    features: [
      {
        title: 'События из RevRoute — через вебхуки',
        text: 'Модуль «Webhooks by Zapier» принимает события RevRoute: клики по ссылкам, лиды, продажи, заявки и регистрации партнёров, начисленные комиссии, подтверждённые выплаты. Вебхук создаётся в настройках рабочего пространства или программы.',
      },
      {
        title: 'Действия в RevRoute — через API',
        text: 'Создание и изменение ссылок, передача лидов и продаж — HTTP-запросами к открытому API RevRoute с персональным API-ключом.',
      },
      {
        title: 'Что учесть',
        text: 'Готовых шаблонов сценариев нет — сценарий настраивается один раз под вашу связку. Модуль вебхуков доступен на платных тарифах Zapier.',
      },
    ],
  },
  {
    slug: 'make',
    name: 'Make.com',
    category: 'automation',
    categoryRu: 'Автоматизация',
    description: 'Связка RevRoute с 2 000+ приложениями через Make — на вебхуках и открытом API.',
    detailedDescription:
      'Готового приложения RevRoute в каталоге Make пока нет. Сценарий собирается на стандартных модулях Make: события RevRoute принимает модуль вебхуков, а запросы к API RevRoute выполняет модуль HTTP.',
    builtBy: 'Make',
    website: 'make.com',
    websiteUrl: 'https://make.com',
    iconLetters: 'Ma',
    iconColor: '#6d00cc',
    docsUrl: '/ru/docs/webhooks',
    features: [
      {
        title: 'Приём событий',
        text: 'Модуль «Custom webhook» в Make принимает события RevRoute: лиды, продажи, заявки и регистрации партнёров, начисленные комиссии, подтверждённые выплаты, клики и изменения ссылок.',
      },
      {
        title: 'Запросы к API',
        text: 'Модуль HTTP создаёт и меняет ссылки, передаёт лиды и продажи в RevRoute через открытый API с персональным API-ключом.',
      },
      {
        title: 'Как подключить',
        text: '1. Создайте в Make сценарий с модулем «Custom webhook» и скопируйте его адрес. 2. В RevRoute откройте настройки вебхуков рабочего пространства или программы, вставьте адрес и выберите события. 3. Соберите остальной сценарий в визуальном редакторе Make.',
      },
    ],
  },
  {
    slug: 'slack',
    name: 'Slack',
    category: 'productivity',
    categoryRu: 'Продуктивность',
    description:
      'Получайте уведомления в Slack о новых лидах, продажах, комиссиях партнёров и других событиях в реальном времени.',
    detailedDescription: 'Получайте уведомления в реальном времени о комиссиях, регистрациях партнёров, лидах, продажах, баунти, событиях ссылок. Создавайте короткие ссылки командой /shorten.',
    builtBy: 'RevRoute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'Sl',
    iconColor: '#4a154b',
    features: [
      {
        title: 'Уведомления в реальном времени',
        text: 'Мгновенные уведомления в выбранный канал Slack: новые комиссии, регистрации партнёров, лиды, продажи, баунти и события ссылок.',
      },
      {
        title: 'Команда /shorten',
        text: 'Создавайте короткие ссылки прямо в Slack, не покидая рабочее пространство.',
      },
      {
        title: 'Как подключить',
        text: '1. Нажмите «Подключить к RevRoute». 2. Авторизуйтесь в Slack и выберите канал. 3. Настройте вебхук-события, которые хотите получать.',
      },
    ],
  },
  {
    slug: 'segment',
    name: 'Segment',
    category: 'analytics',
    categoryRu: 'Аналитика',
    description: 'Отправляйте и получайте события между RevRoute и Segment.',
    detailedDescription: 'Стримьте события в реальном времени в Segment. Поддерживаемые события: link.clicked, lead.created, sale.created.',
    builtBy: 'RevRoute',
    website: 'segment.com',
    websiteUrl: 'https://segment.com',
    iconLetters: 'Se',
    iconColor: '#52bd94',
    features: [
      {
        title: 'Поддерживаемые события',
        text: 'link.clicked — клик по ссылке, lead.created — создание лида, sale.created — создание продажи. Все события транслируются в Segment в реальном времени.',
      },
      {
        title: 'Двусторонняя интеграция',
        text: 'Скоро: отправка событий из Segment в RevRoute для ещё более точного отслеживания конверсий.',
      },
      {
        title: 'Единый поток данных',
        text: 'Объединяйте данные RevRoute с остальными источниками в Segment для построения полной картины пользовательского пути.',
      },
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    category: 'cms',
    categoryRu: 'CMS',
    description: 'Официальная интеграция с WordPress для RevRoute.',
    detailedDescription: 'Официальная интеграция RevRoute с WordPress. Автоматическое создание коротких ссылок, редактирование slug и отслеживание конверсий.',
    builtBy: 'RevRoute',
    website: 'wordpress.org',
    websiteUrl: 'https://wordpress.org',
    iconLetters: 'Wp',
    iconColor: '#21759b',
    features: [
      {
        title: 'Автоматическое создание ссылок',
        text: 'При публикации поста в WordPress автоматически создаётся короткая ссылка RevRoute.',
      },
      {
        title: 'Редактирование slug',
        text: 'Управляйте slug короткой ссылки прямо из редактора WordPress.',
      },
      {
        title: 'Отслеживание конверсий',
        text: 'Подключите отслеживание событий конверсий для анализа эффективности контента.',
      },
    ],
  },
  {
    slug: 'raycast',
    name: 'Raycast',
    category: 'productivity',
    categoryRu: 'Продуктивность',
    description: 'Сокращайте и управляйте ссылками прямо в Raycast.',
    detailedDescription: 'Официальная интеграция RevRoute с Raycast. Сокращайте ссылки, назначайте теги и просматривайте аналитику прямо в Raycast.',
    builtBy: 'RevRoute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'Ra',
    iconColor: '#ff6363',
    features: [
      {
        title: 'Сокращение ссылок',
        text: 'Создавайте короткие ссылки одной командой в Raycast. Назначайте теги для организации.',
      },
      {
        title: 'Список ссылок с аналитикой',
        text: 'Просматривайте все ваши ссылки вместе со статистикой кликов прямо в Raycast.',
      },
      {
        title: 'Быстрый доступ',
        text: 'Мгновенный доступ к функциям RevRoute без переключения контекста.',
      },
    ],
  },
  {
    slug: 'cal',
    name: 'Cal.com',
    category: 'scheduling',
    categoryRu: 'Планирование',
    description:
      'Отслеживайте, как ваши ссылки конвертируются в бронирования встреч в Cal.com.',
    detailedDescription: 'Отслеживайте события конверсий лидов, когда кто-то бронирует встречу через короткие ссылки. Подходит для SaaS-компаний и агентств.',
    builtBy: 'Cal.com',
    website: 'cal.com',
    websiteUrl: 'https://cal.com',
    iconLetters: 'Ca',
    iconColor: '#292929',
    features: [
      {
        title: 'Отслеживание бронирований',
        text: 'Когда пользователь переходит по короткой ссылке и бронирует встречу в Cal.com, событие автоматически фиксируется как лид.',
      },
      {
        title: 'Настройка',
        text: '1. Установите приложение в Cal.com. 2. Подключите скрипт @dub/analytics, добавьте cal.com в outbound-домены. 3. Бронирования автоматически отслеживаются.',
      },
      {
        title: 'Для SaaS и агентств',
        text: 'Идеально подходит для отслеживания enterprise-лидов SaaS-компаний или записей на консультации агентств.',
      },
    ],
  },
  {
    slug: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    categoryRu: 'CRM',
    // Витрина — «что даёт связка», пошаговая настройка — в доках (`docsUrl`).
    description:
      'Сделки и лиды HubSpot связываются с партнёрскими ссылками, а сделка в статусе Closed Won становится продажей и комиссией.',
    detailedDescription:
      'Связка RevRoute и HubSpot закрывает B2B-воронку: контакт, пришедший по короткой ссылке, получает в HubSpot идентификатор клика, созданная сделка фиксируется как лид, а закрытая — как продажа с суммой сделки.',
    builtBy: 'RevRoute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    docsUrl: '/ru/docs/integrations',
    iconLetters: 'Hu',
    iconColor: '#ff7a59',
    features: [
      {
        title: 'Двусторонняя синхронизация',
        text: 'Автоматическая синхронизация данных между RevRoute и HubSpot. Атрибуция лидов и сделок к партнёрским ссылкам.',
      },
      {
        title: 'HubSpot Forms и Meeting Scheduler',
        text: 'Поддержка отслеживания конверсий через HubSpot Forms и планировщик встреч.',
      },
      {
        title: 'Настройка',
        text: '1. Включите отслеживание конверсий. 2. Установите скрипт аналитики. 3. Подключите HubSpot. 4. Опционально: настройте Closed Won Deal Stage ID для автоматического создания комиссий.',
      },
    ],
  },
  {
    slug: 'publer',
    name: 'Publer',
    category: 'social',
    categoryRu: 'Соцсети',
    description:
      'Автоматически сокращайте каждую ссылку в соцсетях через Publer с помощью RevRoute.',
    detailedDescription: 'Платформа управления соцсетями с интеграцией RevRoute. Автоматическое сокращение ссылок, улучшенный вид постов, аналитика.',
    builtBy: 'Kalemi Code LLC',
    website: 'publer.com',
    websiteUrl: 'https://publer.com',
    iconLetters: 'Pu',
    iconColor: '#4f46e5',
    features: [
      {
        title: 'Автоматическое сокращение',
        text: 'Все ссылки в ваших постах автоматически сокращаются через RevRoute при публикации через Publer.',
      },
      {
        title: 'Улучшенная эстетика постов',
        text: 'Короткие ссылки RevRoute выглядят чище и профессиональнее в публикациях в соцсетях.',
      },
      {
        title: 'Настройка',
        text: '1. Подключите аккаунт RevRoute в Publer. 2. Планируйте посты как обычно. 3. Ссылки автоматически сокращаются.',
      },
    ],
  },
  {
    slug: 'gtm',
    name: 'Google Tag Manager',
    category: 'analytics',
    categoryRu: 'Аналитика',
    description:
      'Отслеживайте события конверсий с помощью Google Tag Manager и RevRoute.',
    builtBy: 'RevRoute',
    website: 'tagmanager.google.com',
    websiteUrl: 'https://tagmanager.google.com',
    iconLetters: 'GT',
    iconColor: '#4285f4',
    isGuide: true,
    // Отдельного руководства по GTM в документации нет — ведём в корень докс,
    // а не выдумываем несуществующую страницу. Появится гайд — поменять здесь.
    guideUrl: '/ru/docs',
  },
  {
    slug: 'better-auth',
    name: 'Better Auth',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Better Auth с RevRoute Conversions.',
    builtBy: 'RevRoute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'BA',
    iconColor: '#0ea5e9',
    isGuide: true,
    guideUrl: '/ru/docs/conversions/leads/better-auth',
  },
  {
    slug: 'clerk',
    name: 'Clerk',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Clerk с RevRoute Conversions.',
    builtBy: 'RevRoute',
    website: 'clerk.com',
    websiteUrl: 'https://clerk.com',
    iconLetters: 'Cl',
    iconColor: '#6c47ff',
    isGuide: true,
    guideUrl: '/ru/docs/conversions/leads/clerk',
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Supabase с RevRoute Conversions.',
    builtBy: 'RevRoute',
    website: 'supabase.com',
    websiteUrl: 'https://supabase.com',
    iconLetters: 'Su',
    iconColor: '#3ecf8e',
    isGuide: true,
    guideUrl: '/ru/docs/conversions/leads/supabase',
  },
  {
    slug: 'appwrite',
    name: 'Appwrite',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Appwrite с RevRoute Conversions.',
    builtBy: 'RevRoute',
    website: 'appwrite.io',
    websiteUrl: 'https://appwrite.io',
    iconLetters: 'Aw',
    iconColor: '#f02e65',
    isGuide: true,
    guideUrl: '/ru/docs/conversions/leads/appwrite',
  },
  {
    slug: 'acme',
    name: 'Acme',
    category: 'oauth',
    categoryRu: 'OAuth',
    description:
      'Пример OAuth-приложения RevRoute — интеграция через OAuth 2.0.',
    detailedDescription: 'Пример OAuth 2.0 приложения RevRoute. Демонстрирует, как аутентифицировать пользователей через OAuth 2.0 поток RevRoute.',
    builtBy: 'RevRoute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'Ac',
    iconColor: '#78716c',
    isDemo: true,
    features: [
      {
        title: 'OAuth 2.0 авторизация',
        text: 'Полный пример реализации OAuth 2.0 авторизации с RevRoute, включая получение токенов и обновление сессий.',
      },
      {
        title: 'Как начать',
        text: '1. Создайте интеграцию в рабочем пространстве RevRoute. 2. Настройте redirect URI. 3. Скопируйте Client ID и Client Secret. 4. Установите зависимости. 5. Нажмите «Войти через RevRoute».',
      },
      {
        title: 'Для разработчиков',
        text: 'Используйте этот пример как отправную точку для создания собственных OAuth-интеграций с RevRoute.',
      },
    ],
  },
  {
    slug: 'polar',
    name: 'Polar',
    category: 'payments',
    categoryRu: 'Платежи',
    description:
      'Отслеживайте, как ваши ссылки конвертируются в продажи в Polar.',
    builtBy: 'RevRoute',
    website: 'polar.sh',
    websiteUrl: 'https://polar.sh',
    iconLetters: 'Po',
    iconColor: '#0062ff',
    isComingSoon: true,
  },
  {
    slug: 'typefully',
    name: 'Typefully',
    category: 'social',
    categoryRu: 'Соцсети',
    description:
      'Автоматически сокращайте каждую ссылку в соцсетях на Typefully с помощью RevRoute.',
    builtBy: 'RevRoute',
    website: 'typefully.com',
    websiteUrl: 'https://typefully.com',
    iconLetters: 'Ty',
    iconColor: '#1d9bf0',
    isComingSoon: true,
  },
]

export const categories = [
  { key: 'all', label: 'Все' },
  { key: 'payments', label: 'Платежи' },
  { key: 'automation', label: 'Автоматизация' },
  { key: 'analytics', label: 'Аналитика' },
  { key: 'scheduling', label: 'Планирование' },
  { key: 'auth', label: 'Аутентификация' },
  { key: 'social', label: 'Соцсети' },
  { key: 'productivity', label: 'Продуктивность' },
  { key: 'cms', label: 'CMS' },
  { key: 'crm', label: 'CRM' },
  { key: 'oauth', label: 'OAuth' },
]

export const featuredSlugs = ['shopify', 'zapier', 'gtm', 'hubspot']
