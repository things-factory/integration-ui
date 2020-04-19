/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

/**
http body editor element

Example:

  <things-editor-http-body value=${map}>
  </things-editor-http-body>
*/
export default class ThingsEditorHttpBody extends LitElement {
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
          margin: 5px 0;
        }

        div {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }

        div[kind] {
          border-bottom: 1px solid #aaa;
          background-color: #ddd;
        }

        div[accessor] {
          background-color: #eee;
        }

        label {
          margin: 0 12px 0 3px;
        }

        #accessor {
          flex: 1;
          min-height: 20px;
          margin: 2px;
        }
      `
    ]
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onChange.bind(this))
  }

  render() {
    var { kind = 'none', accessor = '' } = this.value || {}

    return html`
      <div kind>
        <input type="radio" id="none" name="kind" .checked=${kind == 'none'} value="none" />
        <label for="none">none</label>

        <input type="radio" id="form-data" name="kind" .checked=${kind == 'form-data'} value="form-data" />
        <label for="form-data">form-data</label>

        <input
          type="radio"
          id="x-www-form-urlencoded"
          name="kind"
          .checked=${kind == 'x-www-form-urlencoded'}
          value="x-www-form-urlencoded"
        />
        <label for="x-www-form-urlencoded">x-www-form-urlencoded</label>

        <input type="radio" id="raw" name="kind" .checked=${kind == 'raw'} value="raw" />
        <label for="raw">raw</label>

        <input type="radio" id="binary" name="kind" .checked=${kind == 'binary'} value="binary" disabled />
        <label for="binary">binary</label>

        <input type="radio" id="GraphQL" name="kind" .checked=${kind == 'GraphQL'} value="GraphQL" disabled />
        <label for="GraphQL">GraphQL</label>
      </div>

      ${kind !== 'none'
        ? html`
            <div accessor>
              <label for="accessor">accessor</label>
              <input type="text" id="accessor" name="accessor" placeholder="accessor" .value=${accessor} />
            </div>
          `
        : html``}
    `
  }

  _onChange(e) {
    var input = e.target

    this.value = {
      ...this.value,
      [input.name]: input.value
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  // _build(includeNewRecord) {
  //   if (includeNewRecord) var records = this.renderRoot.querySelectorAll('[data-record],[data-record-new]')
  //   else var records = this.renderRoot.querySelectorAll('[data-record]')

  //   var newmap = {}

  //   for (var i = 0; i < records.length; i++) {
  //     var record = records[i]

  //     var key = record.querySelector('[data-key]').value
  //     var inputs = record.querySelectorAll('[data-value]:not([style*="display: none"])')
  //     if (!inputs || inputs.length == 0) continue

  //     var input = inputs[inputs.length - 1]

  //     var value = input.value

  //     if (key) newmap[key] = value || ''
  //   }

  //   this.value = newmap
  //   this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  // }
}

customElements.define('things-editor-http-body', ThingsEditorHttpBody)
