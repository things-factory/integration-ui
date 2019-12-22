import gql from 'graphql-tag'
import '@material/mwc-icon'

import { client } from '@things-factory/shell'
import { DynamicSelector } from './dynamic-selector'

const FETCH_CONNECTORS_GQL = gql`
  {
    connectors {
      items {
        name
        description
      }

      total
    }
  }
`

export class ConnectorSelector extends DynamicSelector {
  async getOptions() {
    var response = await client.query({
      query: FETCH_CONNECTORS_GQL
    })

    return (response && response.data && response.data.connectors.items) || []
  }
}

customElements.define('connector-selector', ConnectorSelector)
