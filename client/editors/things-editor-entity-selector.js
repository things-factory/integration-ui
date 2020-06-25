/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'
import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import { i18next } from '@things-factory/i18n-base'

import './entity-selector'

export default class ThingsEditorEntitySelector extends LitElement {
  static get properties() {
    return {
      value: String,
      properties: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: inline-block;
        }

        input[type='text'] {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }

        mwc-icon {
          position: absolute;
          top: 0;
          right: 0;
        }
      `
    ]
  }

  render() {
    return html`
      <input id="text" type="text" .value=${this.value || ''} @change=${e => this._onInputChanged(e)} />

      <mwc-icon @click=${e => this.openSelector(e)}>dashboard</mwc-icon>
    `
  }

  _onInputChanged(e) {
    e.stopPropagation()

    this.value = e.target.value
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true
      })
    )
  }

  openSelector() {
    if (this.popup) {
      delete this.popup
    }

    var template = html`
      <entity-selector
        .creatable=${true}
        .queryName=${this.properties.queryName}
        @entity-selected=${e => {
          e.stopPropagation()

          var entity = e.detail.entity
          this.value = entity[this.properties.valueKey || 'id']

          this.dispatchEvent(
            new CustomEvent('change', {
              bubbles: true,
              composed: true
            })
          )

          this.popup && this.popup.close()
        }}
      ></entity-selector>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.select entity')
    })
  }
}

customElements.define('things-editor-entity-selector', ThingsEditorEntitySelector)
