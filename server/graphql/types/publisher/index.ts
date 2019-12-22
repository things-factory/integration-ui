import { Filter, Pagination, Sorting } from '@things-factory/shell'
import { NewPublisher } from './new-publisher'
import { Publisher } from './publisher'
import { PublisherList } from './publisher-list'
import { PublisherPatch } from './publisher-patch'

export const Mutation = /* GraphQL */ `
  createPublisher (
    publisher: NewPublisher!
  ): Publisher

  updatePublisher (
    id: String!
    patch: PublisherPatch!
  ): Publisher

  deletePublisher (
    id: String!
  ): Publisher

  deletePublishers (
    ids: [String]!
  ): Publisher

`

export const Query = /* GraphQL */ `
  publishers(filters: [Filter], pagination: Pagination, sortings: [Sorting]): PublisherList
  publisher(id: String!): Publisher
`

export const Types = [Filter, Pagination, Sorting, Publisher, PublisherList, NewPublisher, PublisherPatch]
