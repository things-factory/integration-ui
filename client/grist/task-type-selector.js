import gql from 'graphql-tag'
import '@material/mwc-icon'

import { client } from '@things-factory/shell'
import { DynamicSelector } from './dynamic-selector'

const FETCH_TASK_TYPES_GQL = gql`
  {
    taskTypes {
      items {
        name
        description
      }

      total
    }
  }
`

export class TaskTypeSelector extends DynamicSelector {
  async getOptions() {
    var response = await client.query({
      query: FETCH_TASK_TYPES_GQL
    })

    return (response && response.data && response.data.taskTypes.items) || []
  }
}

customElements.define('task-type-selector', TaskTypeSelector)
