import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import './json-editor'

export class JsonGristEditor extends LitElement {
  static get properties() {
    return {
      value: Object,
      column: Object,
      record: Object,
      row: Number
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        padding: 7px 0px;
        box-sizing: border-box;

        width: 100%;
        height: 100%;

        border: 0;
        background-color: transparent;

        font: var(--grist-object-editor-font);
        color: var(--grist-object-editor-color);

        justify-content: inherit;
      }

      span {
        display: flex;
        flex: auto;

        justify-content: inherit;
      }

      mwc-icon {
        width: 20px;
        font-size: 1.5em;
        margin-left: auto;
      }
    `
  }

  render() {
    return html`
      ${this.value}
    `
  }

  async firstUpdated() {
    this.value = this.record[this.column.name]
    this.template = ((this.column.record || {}).options || {}).template

    await this.updateComplete

    this.shadowRoot.addEventListener('click', e => {
      e.stopPropagation()

      this.openEditor()
    })

    this.openEditor()
  }

  openEditor() {
    if (this.popup) {
      delete this.popup
    }

    const confirmCallback = value => {
      console.log('changed value', value)
      this.dispatchEvent(
        new CustomEvent('field-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: this.value,
            after: value,
            record: this.record,
            column: this.column,
            row: this.row
          }
        })
      )
    }

    var value = this.value || ''
    var template =
      this.template ||
      html`
        <json-editor .value=${value} .confirmCallback=${confirmCallback.bind(this)}></json-editor>
      `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: 'select item'
    })
  }
}

customElements.define('json-grist-editor', JsonGristEditor)
