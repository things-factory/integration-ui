import { Connections } from '../../../engine/connections'

export const connectorResolver = {
  connector(_: any, { name }, context: any) {
    var connector = Connections.getConnector(name)

    return {
      name,
      description: '',
      parameterSpec: connector.parameterSpec
    }
  }
}
