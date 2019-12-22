import { publishersResolver } from '../graphql/resolvers/publisher/publishers'
export async function publishers() {
  return await publishersResolver.publishers(null, {}, null)
}
