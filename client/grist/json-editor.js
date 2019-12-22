/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css, unsafeCSS } from 'lit-element'
import { i18next } from '@things-factory/i18n-base'

import CodeMirrorStyle from '!!text-loader!codemirror/lib/codemirror.css'
import FullScreenStyle from '!!text-loader!codemirror/addon/display/fullscreen.css'
import NightThemeStyle from '!!text-loader!codemirror/theme/night.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/autorefresh'

/**
  WEB Component for code-mirror json editor.
*/
export class JsonEditor extends LitElement {
  static get properties() {
    return {
      /**
       * `value`는 에디터에서 작성중인 contents이다.
       */
      value: String,
      confirmCallback: Object
    }
  }

  static get styles() {
    return [
      css`
        ${unsafeCSS(CodeMirrorStyle)}
        ${unsafeCSS(FullScreenStyle)}
        ${unsafeCSS(NightThemeStyle)}
      `,
      css`
        :host {
          display: flex;
          flex-direction: column;

          background-color: #fff;

          width: var(--overlay-center-normal-width, 50%);
          height: var(--overlay-center-normal-height, 50%);
        }

        .CodeMirror {
          flex: 1;
          resize: none;
          font-size: 16px;
          line-height: 20px;
          border: 0px;
          padding: 0px;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }
      `
    ]
  }

  firstUpdated() {
    this.editor.focus()
  }

  updated(change) {
    if (change.has('value')) {
      this.editor.setValue(this.value === undefined ? '' : String(this.value))
      this.editor.refresh()
    }
  }

  render() {
    return html`
      <textarea></textarea>

      <div class="button-container">
        <mwc-button @click=${this.oncancel.bind(this)}>${i18next.t('button.cancel')}</mwc-button>
        <mwc-button @click=${this.onconfirm.bind(this)}>${i18next.t('button.confirm')}</mwc-button>
      </div>
    `
  }

  get editor() {
    if (!this._editor) {
      let textarea = this.shadowRoot.querySelector('textarea')

      if (textarea) {
        this._editor = CodeMirror.fromTextArea(textarea, {
          value: this.value,
          mode: 'javascript',
          tabSize: 2,
          lineNumbers: false,
          showCursorWhenSelecting: true,
          theme: 'night',
          autoRefresh: {
            delay: 500
          }
        })
      }
    }

    return this._editor
  }

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.editor.getValue())
    history.back()
  }
}

customElements.define('json-editor', JsonEditor)
