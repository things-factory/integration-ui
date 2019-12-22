import { Connection } from './connection'
import { NewConnection } from './new-connection'
import { ConnectionPatch } from './connection-patch'
import { ConnectionList } from './connection-list'

export const Mutation = `
  createConnection (
    connection: NewConnection!
  ): Connection

  updateConnection (
    name: String!
    patch: ConnectionPatch!
  ): Connection

  updateMultipleConnection (
    patches: [ConnectionPatch]!
  ): [Connection]

  deleteConnection (
    name: String!
  ): Boolean

  deleteConnections (
    names: [String]!
  ): Boolean

  connectConnection (
    name: String!
  ): Connection

  disconnectConnection (
    name: String!
  ): Connection
`

export const Query = `
  connections(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ConnectionList
  connection(name: String!): Connection
`

export const Types = [Connection, NewConnection, ConnectionPatch, ConnectionList]
