import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client'
import { BatchHttpLink } from 'apollo-link-batch-http'
import 'cross-fetch/polyfill'

const defaultOptions: any = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache', //'network-only'
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}

const cache = new InMemoryCache({
  addTypename: false
})

export class GraphqlConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('graphql-connector connections are ready')
  }

  async connect(connection) {
    var { endpoint: uri } = connection

    var httpOptions = {
      uri,
      credentials: 'include'
    }

    var httpLink = ApolloLink.split(
      operation => operation.getContext().hasUpload,
      createUploadLink(httpOptions),
      new BatchHttpLink(httpOptions)
    )

    var ERROR_HANDLER: any = ({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) => {
          logger.error(`[GraphQL error] Message: ${message}, Location: ${locations}, Path: ${path}`)
        })

      if (networkError) {
        logger.error(`[Network error - ${networkError.statusCode}] ${networkError}`)
      }
    }

    Connections.addConnection(
      connection.name,
      new ApolloClient({
        defaultOptions,
        cache,
        link: ApolloLink.from([onError(ERROR_HANDLER), httpLink])
      })
    )
  }

  async disconnect(name) {
    var client = Connections.getConnection(name)
    client.stop()
    Connections.removeConnection(name)
  }
}

Connections.registerConnector('graphql-connector', new GraphqlConnector())
