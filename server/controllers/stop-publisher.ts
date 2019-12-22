import { updatePublisher } from '../graphql/resolvers/publisher/update-publisher'

export async function stopPublisher(id, context) {
  var globalObject = global as any
  if (!globalObject.jobs) globalObject.jobs = {}

  var job = globalObject.jobs[id]
  if (job) {
    job.stop()
    delete globalObject.jobs[id]
  }

  updatePublisher.updatePublisher(
    null,
    {
      id,
      patch: {
        status: 0
      }
    },
    context
  )

  return {
    id
  }
}
