import { updatePublisher as updatePublisherResolver } from '../graphql/resolvers/publisher/update-publisher'
import { Publisher } from 'server/entities'
import { Context } from 'apollo-server-core'

export type UpdatePublisherIn = {
  id: string
  publisher: Publisher
  context?: Context
}
export async function updatePublisher({ id, publisher, context = { state: {} } }: UpdatePublisherIn) {
  return await updatePublisherResolver.updatePublisher(
    null,
    {
      id,
      patch: publisher
    },
    context
  )
}
