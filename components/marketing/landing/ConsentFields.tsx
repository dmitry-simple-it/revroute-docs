/**
 * Согласия под лид-формами: обработка персональных данных и рекламные рассылки.
 *
 * Два ОТДЕЛЬНЫХ чекбокса, ни один не отмечен заранее — так предписывает
 * собственная Политика (`content/ru/legal/privacy.mdx`, п. 2 преамбулы
 * Приложений и Приложение № 3): «отдельный элемент интерфейса (чекбокс),
 * который не является предварительно отмеченным; согласие выражается активным
 * действием субъекта», причём согласие на обработку ПДн оформляется отдельно
 * от согласия на рекламные рассылки.
 *
 * Обязательным сделан только первый: без обработки персональных данных заявку
 * физически нельзя принять (ст. 9 152-ФЗ). Второй — добровольный: ч. 1 ст. 18
 * 38-ФЗ «О рекламе» требует предварительного согласия на рекламу по сетям
 * электросвязи, а Приложение № 3 прямо оговаривает, что «дача данного согласия
 * не является условием регистрации или использования Сервиса». Сделать его
 * обязательным — значит связать услугу с рекламным согласием, это нарушение.
 *
 * Отметки уезжают в POST /api/lead и фиксируются там вместе с временем и IP —
 * согласие имеет смысл только тогда, когда его можно доказать.
 */
const PRIVACY = '/ru/legal/privacy'

const linkStyle = {
  color: 'var(--accent-strong)',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
} as const

export function ConsentFields({ idPrefix }: { idPrefix: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label className="rr-check" htmlFor={`${idPrefix}-consent-pdn`}>
        <input
          type="checkbox"
          id={`${idPrefix}-consent-pdn`}
          name="consentPdn"
          value="yes"
          required
        />
        <span className="rr-check-text">
          Даю согласие на обработку персональных данных, указанных в форме, для связи со мной
          по этой заявке — на условиях{' '}
          <a href={PRIVACY} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Политики обработки персональных данных
          </a>
          . *
        </span>
      </label>

      <label className="rr-check" htmlFor={`${idPrefix}-consent-marketing`}>
        <input
          type="checkbox"
          id={`${idPrefix}-consent-marketing`}
          name="consentMarketing"
          value="yes"
        />
        <span className="rr-check-text">
          Согласен получать информационные и рекламные сообщения о платформе и услугах RevRoute
          по электронной почте, в мессенджерах и по SMS.
          <span className="rr-check-note">
            Необязательно. Отозвать можно в любой момент — письмом на support@revroute.ru или по
            ссылке отписки в самом сообщении.
          </span>
        </span>
      </label>
    </div>
  )
}
