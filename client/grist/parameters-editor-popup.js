import { i18next } from '@things-factory/i18n-base'
import { css, html, LitElement } from 'lit-element'

export class ParametersEditorPopup extends LitElement {
  static get properties() {
    return {
      value: Object,
      props: Object,
      confirmCallback: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          background-color: #fff;

          width: var(--overlay-center-normal-width, 50%);
          height: var(--overlay-center-normal-height, 50%);
        }

        parameters-editor-builder {
          flex: 1;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }
      `
    ]
  }

  get context() {
    return {
      title: i18next.t('title.confirm_arrival_notice')
    }
  }

  render() {
    var props = this.props instanceof Array ? this.props : []

    return html`
      ${props.length > 0
        ? html`
            <parameters-editor-builder
              .value=${this.value}
              .props=${props}
              @property-change=${this.onchange.bind(this)}
            >
            </parameters-editor-builder>
          `
        : html`
            <span>No properties defined</span>
          `}

      <div class="button-container">
        <mwc-button @click=${this.oncancel.bind(this)}>${i18next.t('button.cancel')}</mwc-button>
        <mwc-button @click=${this.onconfirm.bind(this)}>${i18next.t('button.confirm')}</mwc-button>
      </div>
    `
  }

  onchange(e) {
    this.value = e.detail
  }

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.value ? JSON.stringify(this.value) : '')
    history.back()
  }
}

customElements.define('parameters-editor-popup', ParametersEditorPopup)
