/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { css, html, LitElement } from 'lit-element'
import { PropertySharedStyle } from '@things-factory/board-ui/client/board-modeller/property-sidebar/property-shared-style'
import { openPopup } from '@things-factory/layout-base'
import './parameters-editor-builder'
import './parameters-editor-popup'

export class ParametersEditor extends LitElement {
  static get properties() {
    return {
      value: Object,
      column: Object,
      record: Object,
      row: Number,
      field: Object
    }
  }

  static get styles() {
    return [
      PropertySharedStyle,
      css`
        label {
          display: block;
          margin: 10px;

          text-align: right;
          font-size: 1em;
          color: #e46c2e;
          text-transform: capitalize;
        }

        option-builder {
          height: 100px;
        }
      `
    ]
  }

  render() {
    return html`
      ${this.value || ''}
    `
  }

  async firstUpdated() {
    await this.updateComplete

    this.shadowRoot.addEventListener('click', e => {
      e.stopPropagation()

      this.openSelector()
    })

    this.openSelector()
  }

  async openSelector() {
    if (this.popup) {
      delete this.popup
    }

    const confirmCallback = newval => {
      this.dispatchEvent(
        new CustomEvent('field-change', {
          bubbles: true,
          composed: true,
          detail: {
            before: this.value,
            after: newval,
            record: this.record,
            column: this.column,
            row: this.row
          }
        })
      )
    }

    var { options } = this.column.record
    if (typeof options === 'function') {
      options = await options.call(this, this.value, this.column, this.record, this.row, this.field)
    }

    try {
      var value = JSON.parse(this.value)
    } catch (e) {
      var value = {}
    }

    var template = html`
      <parameters-editor-popup .value=${value} .props=${options} .confirmCallback=${confirmCallback}>
      </parameters-editor-popup>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: 'options'
    })
  }
}

window.customElements.define('parameters-editor', ParametersEditor)
