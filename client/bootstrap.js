import '@material/mwc-icon'
import { html } from 'lit-html'

import { navigate, store } from '@things-factory/shell'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_BOARD_EDITORS } from '@things-factory/board-ui'

import { registerEditor } from '@things-factory/grist-ui'

import { ConnectorSelector } from './grist/connector-selector'
import { ConnectionSelector } from './grist/connection-selector'
import { TaskTypeSelector } from './grist/task-type-selector'
import { JsonGristEditor } from './grist/json-grist-editor'
import { ParametersEditor } from './grist/parameters-editor'
import { CrontabEditor } from './grist/crontab-editor'

import { PropertyEditorHttpHeader, PropertyEditorHttpParameter } from './editors/property-editor'
import { PropertyEditorEntitySelector } from './editors/entity-editor'

export default function bootstrap() {
  registerEditor('task-type', TaskTypeSelector)
  registerEditor('connector', ConnectorSelector)
  registerEditor('connection', ConnectionSelector)
  registerEditor('json', JsonGristEditor)
  registerEditor('parameters', ParametersEditor)
  registerEditor('crontab', CrontabEditor)

  /* add user profile morenda */
  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>view_list</mwc-icon>
      `,
      name: 'connection',
      action: () => {
        navigate('connection')
      }
    }
  })

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>view_list</mwc-icon>
      `,
      name: 'scenario',
      action: () => {
        navigate('scenario')
      }
    }
  })
  /* */

  store.dispatch({
    type: ADD_BOARD_EDITORS,
    editors: {
      'http-headers': 'property-editor-http-header',
      'http-parameters': 'property-editor-http-parameter',
      'entity-selector': 'property-editor-entity-selector'
    }
  })
}
