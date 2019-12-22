import '@material/mwc-button'
import '@material/mwc-fab'
import '@material/mwc-icon'
import { ScrollbarStyles } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'

export class PublisherHeader extends LitElement {
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
    return {
      publishers: Array,
      checkedPublishers: Array
    }
  }

  constructor() {
    super()

    this.publishers = []
    this.checkedPublishers = []
  }

  render() {
    return html`
      <div>
        ${this.checkedPublishers.length == this.publishers.length
          ? html`
              <mwc-button
                @click=${e => {
                  this.onDeselectAllButtonClick()
                }}
                >Deselect All</mwc-button
              >
            `
          : html`
              <mwc-button
                @click=${e => {
                  this.onSelectAllButtonClick()
                }}
                >Select All</mwc-button
              >
            `}
      </div>
    `
  }

  updated(change) {}

  stateChanged(state) {}

  onDeselectAllButtonClick() {
    this.dispatchEvent(
      new CustomEvent('publisher-list-deselect-all', {
        bubbles: true,
        composed: true
      })
    )
  }

  onSelectAllButtonClick() {
    this.dispatchEvent(
      new CustomEvent('publisher-list-select-all', {
        bubbles: true,
        composed: true
      })
    )
  }
}

window.customElements.define('publisher-header', PublisherHeader)
