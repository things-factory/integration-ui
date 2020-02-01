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
      css`
        :host {
          color: black;

          overflow: hidden;
          text-overflow: ellipsis;
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

    /* 
      주의 : 이 팝업 템플릿은 layout 모듈에 의해서 render 되므로, 
      layout의 구성에 변화가 발생하면, 다시 render된다.
      이 팝업이 떠 있는 상태에서, 또 다른 팝업이 뜨는 경우도 layout 구성의 변화를 야기한다. (overlay의 갯수의 증가)
      이 경우 value, options, confirmCallback 등 클로져를 사용한 것들이 초기 바인딩된 값으로 다시 바인딩되게 되는데,
      만약, 템플릿 내부에서 이들 속성의 레퍼런스가 변화했다면, 원래 상태로 되돌아가는 현상이 발생하게 된다.
      따라서, 가급적 이들 속성의 레퍼런스를 변화시키지 않는 것이 좋다.
    */
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
