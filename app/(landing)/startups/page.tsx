import type { Metadata } from 'next'
import { Button, Eyebrow, Icon } from '@/components/ds/primitives'
import { FaqList } from '@/components/ds/FaqList'
import { StartupApplication } from '@/components/ds/StartupApplication'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'
import './startups.css'

export const metadata: Metadata = {
  title: 'Для стартапов — запуск партнёрских продаж с поддержкой',
  description: 'Скидка 50% на Advanced в первый год, до 6 месяцев без абонентской платы и помощь в запуске. Условия пилотной программы RevRoute согласуем после проверки заявки.',
  alternates: { canonical: '/startups' },
  openGraph: og('/startups'),
}

const OFFERS = [
  {
    name: 'Самостоятельно', icon: 'rocket', audience: 'Для команды, готовой к запуску',
    value: '50%', suffix: 'скидка в первый год',
    phases: [
      ['Первый год', 'Скидка 50%'],
      ['Второй год', 'Скидка 25%'],
      ['С третьего года', 'Обычный тариф'],
    ],
    help: 'Материалы и контрольный список запуска.',
    cta: 'Подать заявку', href: '#apply',
  },
  {
    name: 'Через организацию', icon: 'building-2', audience: 'Для участников акселераторов и сообществ',
    value: '3 месяца', suffix: 'без абонентской платы',
    phases: [
      ['Первые 3 месяца', 'Без абонентской платы'],
      ['До конца первого года', 'Скидка 50%'],
      ['Второй год', 'Скидка 25%'],
      ['С третьего года', 'Обычный тариф'],
    ],
    help: 'Материалы и один общий разбор запуска для участников набора — до 60 минут.',
    cta: 'Указать организацию', href: '#partner-application',
  },
  {
    name: 'Особые условия', icon: 'star', audience: 'Для победителей конкурсов и отобранных компаний',
    value: '6 месяцев', suffix: 'без абонентской платы',
    phases: [
      ['Первые 6 месяцев', 'Без абонентской платы'],
      ['До конца первого года', 'Скидка 50%'],
      ['Второй год', 'Скидка 25%'],
      ['С третьего года', 'Обычный тариф'],
    ],
    help: 'Материалы, вводная встреча до 45 минут и проверка готовности до 30 минут — в первые 60 дней.',
    cta: 'У меня приглашение', href: '#invitation',
  },
]

const FAQ = [
  { q: 'Можно ли участвовать без инвестиций, акселератора и команды?', a: 'Инвестиции не обязательны. Можно подать заявку без команды и указать личную почту. Подтвердим компанию по сайту, продукту или через организацию. Для заявки через организацию потребуется подтверждение участия в её программе. Для участия на особых условиях — номинация.' },
  { q: 'Можно ли участвовать с бесплатным аккаунтом RevRoute?', a: 'Да. Участвовать могут компании, которые раньше не пользовались платными тарифами RevRoute и не получали специальные условия для стартапов. Создавать новый аккаунт вместо старого не нужно. Если вы уже платили, обсудим индивидуальное предложение. Подача заявки не гарантирует скидку.' },
  { q: 'Можно ли совмещать скидки и предложения разных организаций?', a: 'Нет. Специальные предложения и скидки не суммируются.' },
  { q: 'Когда начнут действовать специальные условия и что будет потом?', a: 'Срок отсчитывается с подключения согласованного предложения, а не с подачи заявки или победы в конкурсе. Во второй год предлагаем скидку 25%, с третьего года — обычный тариф. Точные цены и даты согласуем заранее. Для продолжения на платных условиях нужно ваше подтверждение. Отправка заявки не оформляет подписку и не подключает автоплатёж.' },
  { q: 'Входят ли в программу выплаты партнёрам и их подбор?', a: 'Нет. Скидки и бесплатные месяцы относятся к абонентской плате. Помощь в запуске предоставляется в согласованном объёме. Вознаграждения партнёрам оплачиваете вы. Комиссия RevRoute 5% удерживается из бюджета выплат, а не добавляется сверху. Ручной подбор партнёров, индивидуальная упаковка программы, нестандартная разработка, реклама и ведение продаж оплачиваются отдельно.' },
  { q: 'Что означает приглашение или победа в конкурсе?', a: 'Это основание подать заявку на особые условия. Проверим получателя, компанию и условия предложения. Пересланное приглашение или код сами по себе не дают права на специальные условия. До одобрения подписка не активируется. Срок, в который нужно подать заявку по приглашению, согласуем индивидуально.' },
  { q: 'Что делать, если продукт ещё не готов или проекту 5 лет и больше?', a: 'Опишите ситуацию в заявке. Можем запросить дополнительные сведения, предложить подготовиться и подать заявку позже, сообщить, что пока нет мест, или обсудить индивидуальные условия. Компания, которая не соответствует стандартным критериям, может получить особые условия по отдельному согласованию.' },
  { q: 'Что получает организация, которая рекомендует компанию?', a: 'Лояльность и благодарность участников за новые возможности: специальные условия RevRoute и помощь в запуске партнёрских продаж. Стартапы проходят отбор по критериям программы — одной рекомендации для участия недостаточно.' },
]

export default function StartupsPage() {
  return <div className="startup-page">
    <JsonLd data={[
      breadcrumbs([{ name: 'Главная', url: '/' }, { name: 'Для стартапов', url: '/startups' }]),
      faqPage(FAQ),
    ]} />

    <section className="ds-container startup-hero" aria-labelledby="startup-title">
      <div>
        <Eyebrow>RevRoute для стартапов</Eyebrow>
        <h1 id="startup-title" className="rr-display">Запустите партнёрские продажи <span>с поддержкой RevRoute.</span></h1>
        <p className="rr-lead">Специальные условия на платформу и помощь в запуске партнёрской программы.</p>
        <div className="startup-actions rr-cta-row">
          <Button size="lg" href="#apply" iconRight="arrow-right" data-demo-cta="hero">Подать заявку</Button>
          <Button variant="ghost" size="lg" href="#invitation">У меня приглашение</Button>
        </div>
      </div>
      <div className="startup-launch-visual" aria-label="Специальные условия для стартапов">
        <div className="startup-visual-head"><span className="rr-caption">Специальные условия</span><Icon name="rocket" size={21} /></div>
        <div className="startup-visual-benefit"><span><b>50%</b> скидка в первый год</span><span><b>до 6 мес.</b> без абонентской платы</span></div>
        <p className="rr-small"><a href="#offers">Все условия</a></p>
      </div>
    </section>

    <nav className="ds-container startup-section-nav" aria-label="На этой странице">
      <a href="#offers">Условия</a><a href="#eligibility">Кому подходит</a><a href="#launch">Как участвовать</a><a href="#organizations">Организациям</a><a href="#faq">Вопросы</a>
    </nav>

    <section id="offers" className="ds-band ds-container" aria-labelledby="offers-title">
      <div className="startup-section-head"><Eyebrow>Условия программы</Eyebrow>
        <h2 id="offers-title" className="rr-h2">Выберите вариант участия.</h2>
        <p className="rr-lead">Условия пилотной программы на тарифе <a href="/pricing">Advanced</a>. Ниже — скидки и сроки их действия, включая второй год и переход к обычному тарифу.</p>
      </div>
      <div className="startup-offers">
        {OFFERS.map((offer, i) => <article key={offer.name} className={`startup-offer ${i === 1 ? 'startup-offer-featured' : ''}`}>
          <div className="startup-offer-top"><span className="startup-icon"><Icon name={offer.icon} /></span><span className="rr-caption">0{i + 1}</span></div>
          <h3 className="rr-h3">{offer.name}</h3>
          <p className="rr-small startup-offer-audience">{offer.audience}</p>
          <div className="startup-offer-value"><strong>{offer.value}</strong><span>{offer.suffix}</span></div>
          <dl className="startup-phases">{offer.phases.map(([term, benefit]) => <div key={term}><dt>{term}</dt><dd>{benefit}</dd></div>)}</dl>
          <p className="rr-small startup-offer-help"><Icon name="check" size={17} /><span>{offer.help}</span></p>
          <Button variant={i === 1 ? 'primary' : 'ghost'} href={offer.href} style={{ width: '100%', whiteSpace: 'normal', marginTop: 'auto' }}>{offer.cta}</Button>
        </article>)}
      </div>
    </section>

    <section className="startup-help-band" aria-labelledby="help-title">
      <div className="ds-container ds-band startup-help-grid">
        <div><Eyebrow>Помощь в запуске</Eyebrow><h2 id="help-title" className="rr-h2">Материалы для запуска.<br />От предложения до учёта конверсий.</h2><p className="rr-lead">При любом варианте участия вы получите материалы для самостоятельного запуска.</p></div>
        <div className="startup-help-content">
          <ul className="startup-checklist">{['Шаблон партнёрского предложения', 'Пример условий вознаграждения', 'Инструкция по учёту конверсий', 'Контрольный список запуска'].map((text) => <li key={text}><Icon name="check" size={19} />{text}</li>)}</ul>
          <p className="rr-small">Индивидуальная <a href="/packaging">упаковка программы</a>, ручной подбор партнёров, нестандартные интеграции, реклама и ведение продаж — отдельные услуги.</p>
        </div>
      </div>
    </section>

    <section id="eligibility" className="ds-band ds-container" aria-labelledby="eligibility-title">
      <div className="startup-section-head"><Eyebrow>Кому подходит</Eyebrow><h2 id="eligibility-title" className="rr-h2">Продукт уже есть.<br />Теперь нужен партнёрский канал.</h2><p className="rr-lead">Готовность к запуску важнее наличия инвестора. Начать можно без большой команды и собственной сети партнёров.</p></div>
      <div className="startup-criteria-grid">
        <div className="startup-criteria"><span className="rr-caption">01 · Компания</span><h3 className="rr-h3">Стандартные критерии</h3>
          <ul className="startup-checklist">
            <li><Icon name="check" />Проекту меньше 5 лет, в команде менее 30 человек.</li>
            <li><Icon name="check" />Выручка за последние 12 месяцев — не более 100 млн ₽.</li>
            <li><Icon name="check" />Раньше не пользовались платными тарифами RevRoute. Бесплатный аккаунт подходит.</li>
            <li><Icon name="check" />Раньше не получали специальные условия для стартапов от RevRoute.</li>
            <li><Icon name="check" />Участвовать в программе можно один раз на компанию или продукт, независимо от числа аккаунтов.</li>
          </ul>
        </div>
        <div className="startup-criteria"><span className="rr-caption">02 · Готовность</span><h3 className="rr-h3">Готовы начать в ближайшие 30 дней</h3>
          <ul className="startup-checklist">
            <li><Icon name="check" />Есть масштабируемый продукт и успешный опыт продаж: вы знаете свою аудиторию и умеете повторять результат.</li>
            <li><Icon name="check" />Есть ответственный за запуск и общение с партнёрами — хотя бы на частичной занятости.</li>
            <li><Icon name="check" />Готовы настроить прозрачный учёт заявок или сделок.</li>
            <li><Icon name="check" />Есть 3–5 потенциальных партнёров или идеи, где их искать.</li>
          </ul>
        </div>
      </div>
      <p className="rr-small startup-afterword">Не готовы к запуску или не соответствуете одному из критериев? Опишите ситуацию в заявке — обсудим подготовку или индивидуальное предложение.</p>
    </section>

    <section id="launch" className="startup-help-band" aria-labelledby="launch-title">
      <div className="ds-band ds-container">
        <div className="startup-section-head"><Eyebrow>Как принять участие</Eyebrow><h2 id="launch-title" className="rr-h2">От заявки до запуска.</h2></div>
        <ol className="startup-process">
          <li><span>01</span><div><h3 className="rr-h3">Заполните анкету</h3><p className="rr-small">Расскажите о продукте и планах запуска.</p></div></li>
          <li><span>02</span><div><h3 className="rr-h3">Согласуем условия</h3><p className="rr-small">Проверим заявку и обсудим детали по почте.</p></div></li>
          <li><span>03</span><div><h3 className="rr-h3">Начните работу</h3><p className="rr-small">Подключим тариф на согласованных условиях.</p></div></li>
        </ol>
      </div>
    </section>

    <section id="organizations" className="ds-band ds-container" aria-labelledby="organizations-title">
      <div className="startup-organizations">
        <div><Eyebrow>Акселераторам, фондам и сообществам</Eyebrow><h2 id="organizations-title" className="rr-h2">Помогите стартапам<br />запустить партнёрские продажи.</h2><p className="rr-lead">Вы рекомендуете компании и подтверждаете их участие в программе. RevRoute проверяет готовность к запуску и согласует условия.</p><Button href="#organization-application" iconRight="arrow-right">Обсудить сотрудничество</Button></div>
        <div className="startup-organization-formats"><div><Icon name="users" /><h3 className="rr-h3">Условия для участников</h3><p className="rr-small">Три месяца без абонентской платы и один общий разбор запуска для участников, которые соответствуют критериям.</p></div><div><Icon name="star" /><h3 className="rr-h3">Особые условия</h3><p className="rr-small">Вы рекомендуете победителей и отобранные компании. Мы проверим заявки и согласуем особые условия до объявления награды.</p></div></div>
      </div>
    </section>

    <section className="ds-band ds-container startup-application-section" aria-labelledby="apply-title">
      <div className="startup-section-head"><Eyebrow>Участие в программе</Eyebrow><h2 id="apply-title" className="rr-h2">Подайте заявку.</h2></div>
      <StartupApplication />
    </section>

    <section id="faq" className="ds-band ds-container startup-faq" aria-labelledby="faq-title">
      <div className="startup-section-head"><Eyebrow>Вопросы о программе</Eyebrow><h2 id="faq-title" className="rr-h2">Что важно знать до подачи заявки.</h2></div>
      <FaqList items={FAQ} />
    </section>
  </div>
}
