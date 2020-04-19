import '@material/mwc-icon'

import { store } from '@things-factory/shell'
import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'

import { registerEditor } from '@things-factory/grist-ui'

import { ConnectorSelector } from './grist/connector-selector'
import { ConnectionSelector } from './grist/connection-selector'
import { TaskTypeSelector } from './grist/task-type-selector'
import { JsonGristEditor } from './grist/json-grist-editor'
import { ParametersEditor } from './grist/parameters-editor'
import { CrontabEditor } from './grist/crontab-editor'

import './editors/property-editor'
import './editors/entity-editor'

export default function bootstrap() {
  registerEditor('task-type', TaskTypeSelector)
  registerEditor('connector', ConnectorSelector)
  registerEditor('connection', ConnectionSelector)
  registerEditor('json', JsonGristEditor)
  registerEditor('parameters', ParametersEditor)
  registerEditor('crontab', CrontabEditor)

  store.dispatch({
    type: ADD_MODELLER_EDITORS,
    editors: {
      'http-headers': 'property-editor-http-headers',
      'http-parameters': 'property-editor-http-parameters',
      'http-body': 'property-editor-http-body',
      'entity-selector': 'property-editor-entity-selector'
    }
  })
}
