/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

/**
http parameters editor element

Example:

  <things-editor-http-parameters value=${map}>
  </things-editor-http-parameters>
*/
export default class ThingsEditorHttpParameters extends LitElement {
  static get properties() {
    return {
      value: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-content: center;

          width: 100%;
          overflow: hidden;
          border: 1px solid #ccc;
        }

        div {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          border-bottom: 1px solid #c0c0c0;
        }

        div:last-child {
          border-bottom: none;
        }

        div > * {
          min-width: 0px;
          margin: 2px;
          padding: 0;
        }

        button {
          width: 20px;
          text-align: center;
        }

        input {
          flex: 1;
        }
      `
    ]
  }

  constructor() {
    super()

    this.value = {}
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onChange.bind(this))
  }

  render() {
    return html`
      ${this._toArray(this.value).map(
        item => html`
          <div data-record>
            <input type="text" data-key placeholder="key" .value=${item.key} />
            <input type="text" data-value placeholder="value" .value=${item.value} />
            <button class="record-action" @click=${e => this._delete(e)} tabindex="-1">-</button>
          </div>
        `
      )}

      <div data-record-new>
        <input type="text" data-key placeholder="key" value="" />
        <input type="text" data-value placeholder="value" value="" />
        <button class="record-action" @click=${e => this._add(e)} tabindex="-1">+</button>
      </div>
    `
  }

  _onChange(e) {
    if (this._changingNow) {
      return
    }

    this._changingNow = true

    var input = e.target
    var value = input.value

    var div = input.parentElement

    if (div.hasAttribute('data-record')) {
      var dataList = div.querySelectorAll('[data-value]:not([hidden])')
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i] !== input) {
          dataList[i].value = value || ''
        }
      }
    }

    if (div.hasAttribute('data-record')) {
      this._build()
    } else if (div.hasAttribute('data-record-new') && input.hasAttribute('data-value')) {
      this._add()
    }

    this._changingNow = false
  }

  _build(includeNewRecord) {
    if (includeNewRecord) var records = this.renderRoot.querySelectorAll('[data-record],[data-record-new]')
    else var records = this.renderRoot.querySelectorAll('[data-record]')

    var newmap = {}

    for (var i = 0; i < records.length; i++) {
      var record = records[i]

      var key = record.querySelector('[data-key]').value
      var inputs = record.querySelectorAll('[data-value]:not([style*="display: none"])')
      if (!inputs || inputs.length == 0) continue

      var input = inputs[inputs.length - 1]

      var value = input.value

      if (key) newmap[key] = value || ''
    }

    this.value = newmap
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  /* map아이템들을 template(dom-repeat)용 배열로 변환하는 함수 */
  _toArray(map) {
    var array = []

    for (var key in map) {
      array.push({
        key: key,
        value: map[key]
      })
    }

    return array
  }

  _add(e) {
    this._build(true)

    var inputs = this.renderRoot.querySelectorAll('[data-record-new] input:not([style*="display: none"])')

    for (var i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      input.value = ''
    }

    inputs[0].focus()
  }

  _delete(e) {
    var record = e.target.parentElement
    record.querySelector('[data-key]').value = ''
    this._build()
  }
}

customElements.define('things-editor-http-parameters', ThingsEditorHttpParameters)
