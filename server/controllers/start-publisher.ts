import { publisherResolver } from '../graphql/resolvers/publisher/publisher'
import { startPublisherJob } from './start-publisher-job'
import { updatePublisher } from './update-publisher'

export async function startPublisher(id, context) {
  var globalObject = global as any
  if (!globalObject.jobs) globalObject.jobs = {}

  var publisher = await publisherResolver.publisher(null, { id }, null, null)
  startPublisherJob({
    publisher,
    autoStart: true,
    baseURL: context.origin,
    context
  })

  publisher.status = 1
  return await updatePublisher({
    id,
    publisher,
    context
  })
}
