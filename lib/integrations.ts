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
}

export const integrations: Integration[] = [
  {
    slug: 'stripe',
    name: 'Stripe',
    category: 'payments',
    categoryRu: 'Платежи',
    description: 'Отслеживайте, как ваши ссылки конвертируются в продажи в Stripe.',
    detailedDescription: 'Отслеживайте события продаж, бесплатных пробных периодов и возвратов в Stripe как события конверсий в Revroute.',
    builtBy: 'Revroute',
    website: 'marketplace.stripe.com',
    websiteUrl: 'https://marketplace.stripe.com',
    iconLetters: 'St',
    iconColor: '#635bff',
    features: [
      {
        title: 'События продаж',
        text: 'Отслеживайте как разовые, так и рекуррентные платежи в Stripe. Каждая успешная оплата автоматически фиксируется как событие конверсии в Revroute.',
      },
      {
        title: 'Бесплатные пробные периоды',
        text: 'Запуск пробного периода в Stripe отслеживается как событие лида (lead) в Revroute, что позволяет анализировать воронку от клика до пробной версии.',
      },
      {
        title: 'События возвратов',
        text: 'При оформлении возврата в Stripe комиссия партнёра автоматически обновляется до статуса "возврат", обеспечивая точный учёт.',
      },
    ],
  },
  {
    slug: 'shopify',
    name: 'Shopify',
    category: 'payments',
    categoryRu: 'Платежи',
    description: 'Отслеживайте, как ваши ссылки конвертируются в продажи в Shopify.',
    detailedDescription: 'Мощная аналитика конверсий в реальном времени для вашего магазина Shopify.',
    builtBy: 'Revroute',
    website: 'apps.shopify.com',
    websiteUrl: 'https://apps.shopify.com',
    iconLetters: 'Sh',
    iconColor: '#96bf48',
    features: [
      {
        title: 'Аналитика конверсий в реальном времени',
        text: 'Отслеживайте, как короткие ссылки Revroute генерируют продажи в вашем Shopify-магазине. Получайте данные о конверсиях мгновенно.',
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
    description: 'Подключите Revroute к 7 000+ приложениям через Zapier.',
    detailedDescription: 'Официальная интеграция Revroute с Zapier. Подключайте Revroute к 7 000+ приложениям без единой строки кода.',
    builtBy: 'Revroute',
    website: 'zapier.com',
    websiteUrl: 'https://zapier.com',
    iconLetters: 'Za',
    iconColor: '#ff4a00',
    features: [
      {
        title: 'Действия (Actions)',
        text: 'Создание, получение, обновление, upsert и удаление ссылок. Отслеживание событий лидов и продаж.',
      },
      {
        title: 'Триггеры (Triggers)',
        text: 'Автоматические события при создании, обновлении, удалении и клике по ссылке. Триггеры для лидов, продаж, регистрации партнёров и заявок.',
      },
      {
        title: 'Без кода',
        text: 'Не требуется написание кода. Просто подключите аккаунт Revroute и настройте сценарии в визуальном редакторе Zapier.',
      },
    ],
  },
  {
    slug: 'make',
    name: 'Make.com',
    category: 'automation',
    categoryRu: 'Автоматизация',
    description: 'Подключите Revroute к 2 000+ приложениям через Make.com.',
    detailedDescription: 'Официальная интеграция Revroute с Make.com. Подключайте тысячи приложений с помощью визуальных сценариев.',
    builtBy: 'Revroute',
    website: 'make.com',
    websiteUrl: 'https://make.com',
    iconLetters: 'Ma',
    iconColor: '#6d00cc',
    features: [
      {
        title: 'Модули',
        text: 'Создание, обновление, получение, upsert и удаление ссылок. Модуль вызова API для расширенных сценариев.',
      },
      {
        title: 'Как подключить',
        text: '1. Нажмите "Подключить к Revroute" ниже. 2. Разрешите доступ к вашему аккаунту. 3. Используйте модули Revroute в сценариях Make.com.',
      },
      {
        title: 'Визуальные сценарии',
        text: 'Создавайте сложные автоматизации с помощью drag-and-drop интерфейса Make.com, комбинируя Revroute с тысячами других приложений.',
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
    builtBy: 'Revroute',
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
        text: '1. Нажмите "Подключить к Revroute". 2. Авторизуйтесь в Slack и выберите канал. 3. Настройте вебхук-события, которые хотите получать.',
      },
    ],
  },
  {
    slug: 'segment',
    name: 'Segment',
    category: 'analytics',
    categoryRu: 'Аналитика',
    description: 'Отправляйте и получайте события между Revroute и Segment.',
    detailedDescription: 'Стримьте события в реальном времени в Segment. Поддерживаемые события: link.clicked, lead.created, sale.created.',
    builtBy: 'Revroute',
    website: 'segment.com',
    websiteUrl: 'https://segment.com',
    iconLetters: 'Se',
    iconColor: '#52bd94',
    features: [
      {
        title: 'Поддерживаемые события',
        text: 'link.clicked -- клик по ссылке, lead.created -- создание лида, sale.created -- создание продажи. Все события транслируются в Segment в реальном времени.',
      },
      {
        title: 'Двусторонняя интеграция',
        text: 'Скоро: отправка событий из Segment в Revroute для ещё более точного отслеживания конверсий.',
      },
      {
        title: 'Единый поток данных',
        text: 'Объединяйте данные Revroute с остальными источниками в Segment для построения полной картины пользовательского пути.',
      },
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    category: 'cms',
    categoryRu: 'CMS',
    description: 'Официальная интеграция с WordPress для Revroute.',
    detailedDescription: 'Официальная интеграция Revroute с WordPress. Автоматическое создание коротких ссылок, редактирование slug и отслеживание конверсий.',
    builtBy: 'Revroute',
    website: 'wordpress.org',
    websiteUrl: 'https://wordpress.org',
    iconLetters: 'Wp',
    iconColor: '#21759b',
    features: [
      {
        title: 'Автоматическое создание ссылок',
        text: 'При публикации поста в WordPress автоматически создаётся короткая ссылка Revroute.',
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
    detailedDescription: 'Официальная интеграция Revroute с Raycast. Сокращайте ссылки, назначайте теги и просматривайте аналитику прямо в Raycast.',
    builtBy: 'Revroute',
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
        text: 'Мгновенный доступ к функциям Revroute без переключения контекста.',
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
    description:
      'Отслеживайте лиды и сделки HubSpot и автоматически создавайте партнёрские комиссии в Revroute.',
    detailedDescription: 'Отслеживайте и атрибутируйте лиды и продажи из HubSpot. Двусторонняя синхронизация, автоматическая атрибуция, поддержка HubSpot Forms и Meeting Scheduler.',
    builtBy: 'Revroute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'Hu',
    iconColor: '#ff7a59',
    features: [
      {
        title: 'Двусторонняя синхронизация',
        text: 'Автоматическая синхронизация данных между Revroute и HubSpot. Атрибуция лидов и сделок к партнёрским ссылкам.',
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
      'Автоматически сокращайте каждую ссылку в соцсетях через Publer с помощью Revroute.',
    detailedDescription: 'Платформа управления соцсетями с интеграцией Revroute. Автоматическое сокращение ссылок, улучшенный вид постов, аналитика.',
    builtBy: 'Kalemi Code LLC',
    website: 'publer.com',
    websiteUrl: 'https://publer.com',
    iconLetters: 'Pu',
    iconColor: '#4f46e5',
    features: [
      {
        title: 'Автоматическое сокращение',
        text: 'Все ссылки в ваших постах автоматически сокращаются через Revroute при публикации через Publer.',
      },
      {
        title: 'Улучшенная эстетика постов',
        text: 'Короткие ссылки Revroute выглядят чище и профессиональнее в публикациях в соцсетях.',
      },
      {
        title: 'Настройка',
        text: '1. Подключите аккаунт Revroute в Publer. 2. Планируйте посты как обычно. 3. Ссылки автоматически сокращаются.',
      },
    ],
  },
  {
    slug: 'gtm',
    name: 'Google Tag Manager',
    category: 'analytics',
    categoryRu: 'Аналитика',
    description:
      'Отслеживайте события конверсий с помощью Google Tag Manager и Revroute.',
    builtBy: 'Revroute',
    website: 'tagmanager.google.com',
    websiteUrl: 'https://tagmanager.google.com',
    iconLetters: 'GT',
    iconColor: '#4285f4',
    isGuide: true,
    guideUrl: '/ru/docs',
  },
  {
    slug: 'better-auth',
    name: 'Better Auth',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Better Auth с Revroute Conversions.',
    builtBy: 'Revroute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'BA',
    iconColor: '#0ea5e9',
    isGuide: true,
    guideUrl: '/ru/docs',
  },
  {
    slug: 'clerk',
    name: 'Clerk',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Clerk с Revroute Conversions.',
    builtBy: 'Revroute',
    website: 'clerk.com',
    websiteUrl: 'https://clerk.com',
    iconLetters: 'Cl',
    iconColor: '#6c47ff',
    isGuide: true,
    guideUrl: '/ru/docs',
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Supabase с Revroute Conversions.',
    builtBy: 'Revroute',
    website: 'supabase.com',
    websiteUrl: 'https://supabase.com',
    iconLetters: 'Su',
    iconColor: '#3ecf8e',
    isGuide: true,
    guideUrl: '/ru/docs',
  },
  {
    slug: 'appwrite',
    name: 'Appwrite',
    category: 'auth',
    categoryRu: 'Аутентификация',
    description:
      'Отслеживайте события регистрации Appwrite с Revroute Conversions.',
    builtBy: 'Revroute',
    website: 'appwrite.io',
    websiteUrl: 'https://appwrite.io',
    iconLetters: 'Aw',
    iconColor: '#f02e65',
    isGuide: true,
    guideUrl: '/ru/docs',
  },
  {
    slug: 'acme',
    name: 'Acme',
    category: 'oauth',
    categoryRu: 'OAuth',
    description:
      'Пример OAuth-приложения Revroute -- интеграция через OAuth 2.0.',
    detailedDescription: 'Пример OAuth 2.0 приложения Revroute. Демонстрирует, как аутентифицировать пользователей через OAuth 2.0 поток Revroute.',
    builtBy: 'Revroute',
    website: 'revroute.ru',
    websiteUrl: 'https://revroute.ru',
    iconLetters: 'Ac',
    iconColor: '#78716c',
    features: [
      {
        title: 'OAuth 2.0 авторизация',
        text: 'Полный пример реализации OAuth 2.0 авторизации с Revroute, включая получение токенов и обновление сессий.',
      },
      {
        title: 'Как начать',
        text: '1. Создайте интеграцию в рабочем пространстве Revroute. 2. Настройте redirect URI. 3. Скопируйте Client ID и Client Secret. 4. Установите зависимости. 5. Нажмите "Войти через Revroute".',
      },
      {
        title: 'Для разработчиков',
        text: 'Используйте этот пример как отправную точку для создания собственных OAuth-интеграций с Revroute.',
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
    builtBy: 'Revroute',
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
      'Автоматически сокращайте каждую ссылку в соцсетях на Typefully с помощью Revroute.',
    builtBy: 'Revroute',
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

export const featuredSlugs = ['stripe', 'shopify', 'zapier', 'gtm']
