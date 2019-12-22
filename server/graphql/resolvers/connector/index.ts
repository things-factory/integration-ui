import { connectorResolver } from './connector'
import { connectorsResolver } from './connectors'

export const Query = {
  ...connectorsResolver,
  ...connectorResolver
}
