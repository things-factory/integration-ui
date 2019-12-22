import { html } from 'lit-element'
import '@material/mwc-icon'

import { InputEditor } from '@things-factory/grist-ui'

const EMPTY_OPTION = [{ name: '', value: '' }]

export class DynamicSelector extends InputEditor {
  getOptions() {
    return []
  }

  async firstUpdated() {
    super.firstUpdated()

    var { options } = this.column.record || {}

    if (!options) {
      var options = await this.getOptions()
      if (options.unshift) {
        options.unshift(EMPTY_OPTION)
      } else {
        options = EMPTY_OPTION
      }

      this.column.record.options = options
      this.requestUpdate()
    }
  }

  get editorTemplate() {
    var { options = EMPTY_OPTION } = this.column.record || {}

    return html`
      <select>
        ${options.map(
          option => html`
            <option ?selected=${option.name == this.value} value=${option.name}>${option.name}</option>
          `
        )}
      </select>
    `
  }
}
