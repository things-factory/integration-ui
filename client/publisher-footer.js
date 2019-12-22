import '@material/mwc-button'
import '@material/mwc-fab'
import '@material/mwc-icon'
import { ScrollbarStyles } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'

export class PublisherFooter extends LitElement {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.2) 0 0 1rem;
          padding: 20px;
        }

        :host > div {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-basis: 50px;
        }

        :host > div > a {
          color: red;
          text-decoration: none;
        }

        mwc-icon {
          box-shadow: rgba(0, 0, 0, 0.2) 0 0 1rem;
          border-radius: 50%;
          padding: 10px;
        }
      `
    ]
  }

  static get properties() {
    return {}
  }

  constructor() {
    super()
  }

  render() {
    return html`
      <div>
        <a
          href="#"
          @click=${e => {
            this.onDeleteButtonClick(e)
          }}
        >
          <mwc-icon>delete_forever</mwc-icon>
        </a>
      </div>
    `
  }

  updated(change) {}

  stateChanged(state) {}

  onDeleteButtonClick(e) {
    e.preventDefault()

    this.dispatchEvent(
      new CustomEvent('publisher-delete', {
        bubbles: true,
        composed: true
      })
    )
  }
}

window.customElements.define('publisher-footer', PublisherFooter)
