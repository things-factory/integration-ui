/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

export default class ThingsEditorHttpParameters extends LitElement {
  static get is() {
    return 'things-editor-http-parameters'
  }

  static get properties() {
    return {
      values: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        #colors-container > div {
          display: grid;
          grid-template-columns: 22px 1fr 22px;
          grid-gap: 5px;
          align-items: center;
          justify-content: left;
        }

        things-editor-color {
          height: 25px;
          width: 100%;
        }

        input[type='button'] {
          width: 22px;
          height: 25px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding-top: 0px;
          padding-bottom: 2px;
          background-color: #f1f2f4;
          color: #8f9192;
          font-size: 16px;
        }
      `
    ]
  }

  constructor() {
    super()

    this.values = []
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChanged.bind(this))
  }

  // TODO style for things-editor-color
  render() {
    return html`
      <div id="colors-container">
        ${(this.values || []).map(
          (item, index) => html`
            <div>
              <input type="button" value="+" @click="${e => this._appendEditorColor(e)}" data-index=${index} />

              <things-editor-color .value=${item}> </things-editor-color>

              ${(this.values || []).length > 1
                ? html`
                    <input type="button" value="-" @click=${e => this._removeEditorColor(e)} data-index=${index} />
                  `
                : html``}
            </div>
          `
        )}
      </div>
    `
  }

  _onValueChanged(e) {
    this.values = this._getheringValues()
  }

  _appendEditorColor(e) {
    this.values = [...this.values, 'black']

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _removeEditorColor(e) {
    var values = []
    for (var i = 0; i < this.values.length; i++) {
      if (i == e.target.dataset.index) continue
      else values.push(this.values[i])
    }

    this.values = values
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _getheringValues() {
    var colorsContainer = this.shadowRoot.querySelector('#colors-container')
    var values = []
    Array.from(colorsContainer.querySelectorAll('things-editor-color')).forEach(c => {
      values.push(c.value)
    })

    return values
  }
}

customElements.define(ThingsEditorHttpParameters.is, ThingsEditorHttpParameters)
