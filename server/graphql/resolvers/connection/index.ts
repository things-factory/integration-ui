import { connectionResolver } from './connection'
import { connectionsResolver } from './connections'

import { updateConnection } from './update-connection'
import { updateMultipleConnection } from './update-multiple-connection'
import { createConnection } from './create-connection'
import { deleteConnection } from './delete-connection'
import { deleteConnections } from './delete-connections'
import { connectConnection } from './connect-connection'
import { disconnectConnection } from './disconnect-connection'

export const Query = {
  ...connectionsResolver,
  ...connectionResolver
}

export const Mutation = {
  ...updateConnection,
  ...updateMultipleConnection,
  ...createConnection,
  ...deleteConnection,
  ...deleteConnections,
  ...connectConnection,
  ...disconnectConnection
}
