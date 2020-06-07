import { html } from 'lit-element'
import gql from 'graphql-tag'

import { client } from '@things-factory/shell'
import { InputEditor } from '@things-factory/grist-ui'

const FETCH_TASK_TYPES_GQL = gql`
  query($connectionName: String!) {
    taskTypesByConnection(connectionName: $connectionName) {
      items {
        name
      }
    }
  }
`

const EMPTY_OPTION = { name: '', value: '' }

export class TaskTypeSelector extends InputEditor {
  async getOptions() {
    var { connectionName = '' } = this.column.record
    if (typeof connectionName === 'function') {
      connectionName =
        (await connectionName.call(this, this.value, this.column, this.record, this.row, this.field)) || ''
    }

    const response = await client.query({
      query: FETCH_TASK_TYPES_GQL,
      variables: {
        connectionName
      }
    })

    return response?.data?.taskTypesByConnection?.items || []
  }

  async firstUpdated() {
    super.firstUpdated()

    var options = await this.getOptions()
    if (options.unshift) {
      options.unshift(EMPTY_OPTION)
    } else {
      options = [EMPTY_OPTION]
    }

    this.options = options
    this.requestUpdate()
  }

  get editorTemplate() {
    var options = this.options || [EMPTY_OPTION]

    return html`
      <select>
        ${options.map(
          option => html` <option ?selected=${option.name == this.value} value=${option.name}>${option.name}</option> `
        )}
      </select>
    `
  }
}

customElements.define('task-type-selector', TaskTypeSelector)
