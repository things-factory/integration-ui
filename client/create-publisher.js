import '@material/mwc-icon'
import { createPublisher } from '@things-factory/publisher-base/client/graphql/publisher'
import { css, html, LitElement } from 'lit-element'

export class CreatePublisher extends LitElement {
  static get properties() {
    return {}
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          background: #fff;
          height: 100%;
          width: 100%;
          padding: 20px;
          box-shadow: rgba(0, 0, 0, 0.2) 0 0 1rem;
        }

        form {
          display: grid;
          grid-template-columns: 1fr 3fr;
          grid-gap: 5px;
          height: 100%;
          width: 100%;
          background-color: #fff;
        }

        #buttons {
          grid-column: span 2;
          justify-self: flex-end;
        }
      `
    ]
  }

  render() {
    return html`
      <header>
        <h1>Create Publisher</h1>
      </header>
      <form id="form">
        <label for="name">name</label>
        <input id="name" name="name" type="text" />
        <label for="description">description</label>
        <input id="description" name="description" type="text" />
        <label for="crontab">crontab</label>
        <input id="crontab" name="intervalExpr" type="text" />
        <label for="api">api</label>
        <input id="api-url" name="apiUrl" type="text" />
        <div id="buttons">
          <mwc-button @click=${e => this.onCancelButtonClick(e)}>Cancel</mwc-button>
          <mwc-button @click=${e => this.onCreateButtonClick(e)} raised>Create</mwc-button>
        </div>
      </form>
    `
  }

  updated(change) {}

  stateChanged(state) {}

  async onCancelButtonClick(e) {
    history.back()
  }

  async onCreateButtonClick(e) {
    var form = this.renderRoot.querySelector('#form')
    var formData = new FormData(form)
    var formDataObj = Object.fromEntries(formData.entries())

    var { createPublisher: createdPublisher } = await createPublisher(formDataObj)
    this.dispatchEvent(
      new CustomEvent('create-success', {
        bubbles: true,
        composed: true,
        detail: {
          publisher: createdPublisher
        }
      })
    )
  }
}

window.customElements.define('create-publisher', CreatePublisher)
