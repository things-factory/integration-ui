import '@material/mwc-button'
import { i18next } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'

function createCronRegex(type) {
  // https://gist.github.com/dkandalov/a2aed17cfdeb65243022
  var regexByField = {}
  regexByField['sec'] = '[0-5]?\\d'
  regexByField['min'] = '[0-5]?\\d'
  regexByField['hour'] = '[01]?\\d|2[0-3]'
  regexByField['day'] = '0?[1-9]|[12]\\d|3[01]'
  regexByField['month'] = '[1-9]|1[012]'
  regexByField['dayOfWeek'] = '[0-7]'

  var crontabFields = [type]
  if (!type) crontabFields = ['sec', 'min', 'hour', 'day', 'month', 'dayOfWeek']

  crontabFields.forEach(field => {
    var number = regexByField[field]
    var range =
      '(?:' +
      number +
      ')' +
      '(?:' +
      '(?:-|/|,' +
      ('dayOfWeek' === field ? '|#' : '') +
      ')' +
      '(?:' +
      number +
      ')' +
      ')?'
    if (field === 'dayOfWeek') range += '(?:L)?'
    if (field === 'month') range += '(?:L|W)?'
    regexByField[field] = '\\?|\\*|' + range + '(?:,' + range + ')*'
  })

  var monthValues = 'JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC'
  var monthRange = '(?:' + monthValues + ')(?:(?:-)(?:' + monthValues + '))?'
  regexByField['month'] += '|\\?|\\*|' + monthRange + '(?:,' + monthRange + ')*'

  var dayOfWeekValues = 'MON|TUE|WED|THU|FRI|SAT|SUN'
  var dayOfWeekRange = '(?:' + dayOfWeekValues + ')(?:(?:-)(?:' + dayOfWeekValues + '))?'
  regexByField['dayOfWeek'] += '|\\?|\\*|' + dayOfWeekRange + '(?:,' + dayOfWeekRange + ')*'

  if (!type)
    return (
      '^\\s*($' +
      '|#' +
      '|\\w+\\s*=' +
      '|' +
      '(' +
      regexByField['sec'] +
      ')\\s+' +
      '(' +
      regexByField['min'] +
      ')\\s+' +
      '(' +
      regexByField['hour'] +
      ')\\s+' +
      '(' +
      regexByField['day'] +
      ')\\s+' +
      '(' +
      regexByField['month'] +
      ')\\s+' +
      '(' +
      regexByField['dayOfWeek'] +
      ')(|\\s)+' +
      ')$'
    )
  else return `^${regexByField[type]}$`
}

export class CrontabEditorPopup extends LitElement {
  static get properties() {
    return {
      valueString: String,
      second: String,
      minute: String,
      hour: String,
      dayOfMonth: String,
      month: String,
      dayOfWeek: String,
      _tooltip: Array
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        background-color: var(--main-section-background-color);
      }

      :host * {
        box-sizing: border-box;
      }
      :host *:focus {
        outline: none;
      }

      #wrapper {
        display: grid;
        width: 100%;
        height: 100%;
        padding: 1rem;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: auto auto auto 1fr auto;
        grid-gap: 0.5rem;
        justify-content: center;
        align-items: center;
      }

      #wrapper > label[for='example'] {
        text-align: right;
        grid-column: 3;
        font: normal 1em var(--theme-font);
        color: var(--secondary-color);
        text-transform: capitalize;
      }

      #wrapper > select#example {
        grid-column: 4 / span 3;
        width: 100%;
        height: 100%;
        font: normal 0.9em var(--theme-font);
        text-transform: capitalize;
      }

      #wrapper > input {
        width: 100%;
        margin-top: var(--margin-default);
        padding: 5px;
        border-radius: var(--border-radius);
        border: var(--border-dark-color);
        font: normal 1em var(--theme-font);
      }
      #wrapper > input:focus {
        border: 1px solid var(--primary-color);
      }

      #wrapper > input:invalid {
        border: 1px solid var(--status-danger-color);
        color: var(--status-danger-color);
      }

      #wrapper > label {
        width: 100%;
        height: 100%;
        font: normal 0.8em var(--theme-font);
        color: var(--primary-color);
      }

      #wrapper > label:not([for='example']) {
        text-align: center;
      }

      #tooltip {
        grid-column: span 6;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 0;
        margin: auto;
        grid-auto-rows: min-content;
        align-self: center;
        align-items: center;
      }

      #tooltip > div {
        padding: 0.25rem 0.5rem;
        border-bottom: #ccc 1px dashed;
        font: normal 0.9em var(--theme-font);
      }

      #tooltip > .crontab-value {
        text-align: right;
        color: var(--secondary-color);
      }

      #tooltip > .crontab-description {
        text-align: left;
        color: #585858;
      }

      mwc-button {
        background-color: var(--secondary-color);
        border-radius: var(--button-border-radius);
        grid-column: 5 / span 2;
        justify-self: flex-end;
        --mdc-theme-primary: #fff;
      }
      mwc-button:hover,
      mwc-button:active {
        background-color: var(--primary-color);
      }
    `
  }

  render() {
    return html`
      <form
        id="wrapper"
        @keydown=${e => {
          if (e.key === 'Tab') {
            e.stopPropagation()
            e.preventDefault()
            var focused = this.renderRoot.querySelector(':focus')
            var focusedIdx = this.focusableElements.findIndex(el => el == focused)
            var nextFocusIdx = (e.shiftKey ? focusedIdx - 1 : focusedIdx + 1) % this.focusableElements.length
            if (nextFocusIdx == -1) nextFocusIdx = this.focusableElements.length - 1

            this.focusableElements[nextFocusIdx].focus()
          } else if (e.key == 'Enter') {
            e.stopPropagation()
            e.preventDefault()
            this.confirm()
          }
        }}
      >
        <label for="example">${i18next.t('label.examples')}</label>
        <select id="example" @change=${e => (this.valueString = e.currentTarget.value)}>
          <optgroup label="${i18next.t('label.second by second')}">
            <option value="* * * * * *">${i18next.t('text.every second')}</option>
            <option value="0/2 * * * * *">${i18next.t('text.every 2 seconds')}</option>
            <option value="0/15 * * * * *">${i18next.t('text.every 15 seconds')}</option>
            <option value="0/30 * * * * *">${i18next.t('text.every 30 seconds')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.minute by minute')}">
            <option value="0 * * * * *">${i18next.t('text.every minute')}</option>
            <option value="0 0/2 * * * *">${i18next.t('text.every 2 minutes')}</option>
            <option value="0 0/15 * * * *">${i18next.t('text.every 15 minutes')}</option>
            <option value="0 0/30 * * * *">${i18next.t('text.every half hour')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.hourly')}">
            <option value="0 0 * * * *">${i18next.t('text.every hour')}</option>
            <option value="0 0 0/2 * * *">${i18next.t('text.every 2 hours')}</option>
            <option value="0 0 0/12 * * *">${i18next.t('text.every 12 hours')}</option>
            <option value="0 0 10-19 * * *">${i18next.t('text.every hour during working time')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.daily')}">
            <option value="0 0 0 * * *">${i18next.t('text.every day')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.weekly')}">
            <option value="0 0 0 * * SUN">${i18next.t('text.every sunday')}</option>
            <option value="0 0 0 * * 0">${i18next.t('text.every sunday(2)')}</option>
            <option value="0 0 0 * * 1-5">${i18next.t('text.every weekday')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.monthly')}">
            <option value="0 0 0 1 * *">${i18next.t('text.the first day of every month')}</option>
            <option value="0 0 10 21 * *">${i18next.t('text.10 am on every payday')}</option>
          </optgroup>
          <optgroup label="${i18next.t('label.yearly')}">
            <option value="0 0 0 1 1 *">${i18next.t('text.the first day of every year')}</option>
            <option value="0 0 0 25 12 *">${i18next.t('text.every christmas')}</option>
          </optgroup>
        </select>
        <input
          id="second-input"
          type="text"
          .value=${this.second}
          @input=${e => (this.second = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'second' })
          }}
          pattern="${createCronRegex('sec')}"
          required
        />
        <input
          id="minute-input"
          type="text"
          .value=${this.minute}
          @input=${e => (this.minute = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'minute' })
          }}
          pattern="${createCronRegex('min')}"
          required
        />
        <input
          id="hour-input"
          type="text"
          .value=${this.hour}
          @input=${e => (this.hour = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'hour' })
          }}
          pattern="${createCronRegex('hour')}"
          required
        />
        <input
          id="day-of-month-input"
          type="text"
          .value=${this.dayOfMonth}
          @input=${e => (this.dayOfMonth = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'dayOfMonth' })
          }}
          pattern="${createCronRegex('day')}"
          required
        />
        <input
          id="month-input"
          type="text"
          .value=${this.month}
          @input=${e => (this.month = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'month' })
          }}
          pattern="${createCronRegex('month')}"
          required
        />
        <input
          id="day-of-week-input"
          type="text"
          .value=${this.dayOfWeek}
          @input=${e => (this.dayOfWeek = e.currentTarget.value)}
          @focus=${e => {
            this.showTooltip({ type: 'dayOfWeek' })
          }}
          pattern="${createCronRegex('dayOfWeek')}"
          required
        />
        <label for="second-input">${i18next.t('label.second')}</label>
        <label for="minute-input">${i18next.t('label.minute')}</label>
        <label for="hour-input">${i18next.t('label.hour')}</label>
        <label for="day-of-month-input">${i18next.t('label.day-of-month')}</label>
        <label for="month-input">${i18next.t('label.month')}</label>
        <label for="day-of-week-input">${i18next.t('label.day-of-week')}</label>
        <div id="tooltip">
          ${this._tooltip.map(
            tip => html`
              <div class="crontab-value">${tip.value}</div>
              <div class="crontab-description">${i18next.t(`text.${tip.description}`)}</div>
            `
          )}
        </div>
        <mwc-button
          icon="done"
          .label="${i18next.t('label.confirm')}"
          @click=${e => {
            this.confirm()
          }}
        ></mwc-button>
      </form>
    `
  }

  get focusableElements() {
    return Array.from(this.renderRoot.querySelectorAll('select, input, mwc-button'))
  }

  connectedCallback() {
    super.connectedCallback()

    this._tooltip = []
  }

  firstUpdated() {
    this.renderRoot.querySelector('input').focus()
  }

  updated(changed) {
    if (changed.has('valueString')) {
      var values = this.valueString.split(' ')

      if (values.length == 1) values = ['*', '*', '*', '*', '*', '*']
      else if (values.length == 5) values = ['0'].concat(values)

      this.second = values[0]
      this.minute = values[1]
      this.hour = values[2]
      this.dayOfMonth = values[3]
      this.month = values[4]
      this.dayOfWeek = values[5]
    }
  }

  showTooltip({ type }) {
    switch (type) {
      case 'second':
      case 'minute':
        this._tooltip = [
          {
            value: '*',
            description: 'any value'
          },
          {
            value: ',',
            description: 'value list separator'
          },
          {
            value: '-',
            description: 'range of values'
          },
          {
            value: '/',
            description: 'step values'
          },
          {
            value: '0-59',
            description: 'allowed values'
          }
        ]
        break
      case 'hour':
        this._tooltip = [
          {
            value: '*',
            description: 'any value'
          },
          {
            value: ',',
            description: 'value list separator'
          },
          {
            value: '-',
            description: 'range of values'
          },
          {
            value: '/',
            description: 'step values'
          },
          {
            value: '0-23',
            description: 'allowed values'
          }
        ]
        break

      case 'dayOfMonth':
        this._tooltip = [
          {
            value: '*',
            description: 'any value'
          },
          {
            value: ',',
            description: 'value list separator'
          },
          {
            value: '-',
            description: 'range of values'
          },
          {
            value: '/',
            description: 'step values'
          },
          {
            value: '1-31',
            description: 'allowed values'
          }
        ]
        break

      case 'month':
        this._tooltip = [
          {
            value: '*',
            description: 'any value'
          },
          {
            value: ',',
            description: 'value list separator'
          },
          {
            value: '-',
            description: 'range of values'
          },
          {
            value: '/',
            description: 'step values'
          },
          {
            value: '1-12',
            description: 'allowed values'
          },
          {
            value: 'JAN-DEC',
            description: 'alternative single values'
          }
        ]
        break

      case 'dayOfWeek':
        this._tooltip = [
          {
            value: '*',
            description: 'any value'
          },
          {
            value: ',',
            description: 'value list separator'
          },
          {
            value: '-',
            description: 'range of values'
          },
          {
            value: '/',
            description: 'step values'
          },
          {
            value: '0-6',
            description: 'allowed values'
          },
          {
            value: 'SUN-SAT',
            description: 'alternative single values'
          }
        ]
        break

      default:
        this._tooltip = []
        break
    }
  }

  confirm() {
    var form = this.renderRoot.querySelector('#wrapper')
    var valid = form.checkValidity()
    if (!valid) {
      form.reportValidity()
      return
    }

    this.dispatchEvent(
      new CustomEvent('crontab-changed', {
        bubbles: true,
        composed: true,
        detail: {
          value: `${this.second} ${this.minute} ${this.hour} ${this.dayOfMonth} ${this.month} ${this.dayOfWeek}`
        }
      })
    )
  }
}

customElements.define('crontab-editor-popup', CrontabEditorPopup)
