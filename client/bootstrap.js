import '@material/mwc-icon'
import { registerEditor as registerGristEditor } from '@things-factory/grist-ui'
import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'
import { store } from '@things-factory/shell'
import './editors/entity-editor'
import './editors/property-editor'
import { ConnectionSelector } from './grist/connection-selector'
import { ConnectorSelector } from './grist/connector-selector'
import { CrontabEditor } from './grist/crontab-editor'
import { JsonGristEditor } from './grist/json-grist-editor'
import { ParametersEditor } from './grist/parameters-editor'
import { TaskTypeSelector } from './grist/task-type-selector'

export default function bootstrap() {
  registerGristEditor('task-type', TaskTypeSelector)
  registerGristEditor('connector', ConnectorSelector)
  registerGristEditor('connection', ConnectionSelector)
  registerGristEditor('json', JsonGristEditor)
  registerGristEditor('parameters', ParametersEditor)
  registerGristEditor('crontab', CrontabEditor)

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
