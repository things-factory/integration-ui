import gql from 'graphql-tag'
import '@material/mwc-icon'

import { client } from '@things-factory/shell'
import { DynamicSelector } from './dynamic-selector'

const FETCH_CONNECTIONS_GQL = gql`
  {
    connections {
      items {
        name
        description
      }

      total
    }
  }
`

export class ConnectionSelector extends DynamicSelector {
  async getOptions() {
    var response = await client.query({
      query: FETCH_CONNECTIONS_GQL
    })

    return (response && response.data && response.data.connections.items) || []
  }
}

customElements.define('connection-selector', ConnectionSelector)
