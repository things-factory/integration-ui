import '@material/mwc-button'
import '@material/mwc-fab'
import '@material/mwc-icon'
import { InputEditor } from '@things-factory/grist-ui'
import { openPopup } from '@things-factory/layout-base'
import { html } from 'lit-element'
import './crontab-editor-popup'
import { i18next } from '@things-factory/i18n-base'

export class CrontabEditor extends InputEditor {
  get editorTemplate() {
    return html`
      <input type="text" .value=${this.value} />
    `
  }

  async firstUpdated() {
    await this.updateComplete

    this.shadowRoot.addEventListener('click', e => {
      e.stopPropagation()

      this.showEditorPopup()
    })

    this.showEditorPopup()
  }

  showEditorPopup() {
    var change = value => {
      this.dispatchEvent(
        new CustomEvent('field-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: this.value,
            after: value,
            column: this.column,
            record: this.record,
            row: this.row
          }
        })
      )
    }

    var popup = openPopup(
      html`
        <crontab-editor-popup
          .valueString=${this.value}
          @crontab-changed=${e => {
            change(e.detail.value)
            popup.close()
          }}
        ></crontab-editor-popup>
      `,
      {
        backdrop: true,
        title: i18next.t('title.setting schedule')
      }
    )
  }
}

window.customElements.define('crontab-editor', CrontabEditor)
