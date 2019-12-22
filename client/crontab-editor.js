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
      <input
        type="text"
        .value=${this.value}
        @focus=${e => {
          this.showEditorPopup()
        }}
      />
    `
  }

  firstUpdated() {
    super.firstUpdated()
  }

  showEditorPopup() {
    var popup = openPopup(
      html`
        <crontab-editor-popup
          .valueString=${this.value}
          @crontab-changed=${e => {
            this._dirtyValue = e.detail.value
            popup.close()
          }}
        ></crontab-editor-popup>
      `,
      {
        backdrop: true,
        title: i18next.t('title.setting schedule')
      }
    )

    popup.onclosed = () => {
      this.dispatchEvent(
        new CustomEvent('field-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: this.value,
            after: this._dirtyValue,
            column: this.column,
            record: this.record,
            row: this.row
          }
        })
      )
    }
  }

  showTooltip({ type }) {}
}

window.customElements.define('crontab-editor', CrontabEditor)
