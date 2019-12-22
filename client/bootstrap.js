import '@material/mwc-icon'
import { ADD_MORENDA } from '@things-factory/more-base'
import { navigate, store } from '@things-factory/shell'
import { html } from 'lit-html'

import { registerEditor, registerRenderer, TextRenderer } from '@things-factory/grist-ui'

import { ConnectorSelector } from './grist/connector-selector'
import { ConnectionSelector } from './grist/connection-selector'
import { TaskTypeSelector } from './grist/task-type-selector'
import { JsonGristEditor } from './grist/json-grist-editor'
import { ParametersEditor } from './grist/parameters-editor'

export default function bootstrap() {
  registerRenderer('task-type', TextRenderer)
  registerEditor('task-type', TaskTypeSelector)
  registerRenderer('connector', TextRenderer)
  registerEditor('connector', ConnectorSelector)
  registerRenderer('connection', TextRenderer)
  registerEditor('connection', ConnectionSelector)
  registerRenderer('json', TextRenderer)
  registerEditor('json', JsonGristEditor)
  registerRenderer('parameters', TextRenderer)
  registerEditor('parameters', ParametersEditor)

  /* add user profile morenda */
  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html`
        <mwc-icon>link</mwc-icon>
      `,
      name: 'integration',
      action: () => {
        navigate('integration-setting')
      }
    }
  })

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
}
