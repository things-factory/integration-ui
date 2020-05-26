import '@material/mwc-icon'
import { registerEditor } from '@things-factory/grist-ui'
import { SET_INTEGRATION_MODELLER_SETTINGS } from '@things-factory/integration-base'
import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_SETTING } from '@things-factory/setting-base'
import { client, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { html } from 'lit-html'
import './editors/entity-editor'
import './editors/property-editor'
import { ConnectionSelector } from './grist/connection-selector'
import { ConnectorSelector } from './grist/connector-selector'
import { CrontabEditor } from './grist/crontab-editor'
import { JsonGristEditor } from './grist/json-grist-editor'
import { ParametersEditor } from './grist/parameters-editor'
import { TaskTypeSelector } from './grist/task-type-selector'
import './viewparts/modeller-url-setting-let'
import { INTEGRATION_MODELLER_SETTING_CATEGORY } from './viewparts/modeller-url-setting-let'

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

  store.dispatch({
    type: ADD_SETTING,
    setting: {
      seq: 30,
      template: html` <integration-modeller-setting-let></integration-modeller-setting-let> `
    }
  })

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html` <mwc-icon>account_tree</mwc-icon> `,
      name: html` <i18n-msg msgid="text.modeller"></i18n-msg> `,
      position: 'REAR_END',
      action: async () => {
        window.open('/integration/modeller', 'integration_modeller')
      }
    }
  })

  getIntegrationModellerSettings().then(settings => {
    var settingData = {}

    settings.forEach(setting => {
      settingData[setting.name.replace(/integration.modeller\-(\w+)/, '$1')] = setting.value
    })

    store.dispatch({
      type: SET_INTEGRATION_MODELLER_SETTINGS,
      ...settingData
    })
  })
}

async function getIntegrationModellerSettings() {
  const response = await client.query({
    query: gql`
      query($filters: [Filter], $pagination: Pagination, $sortings: [Sorting]) {
        responses: settings(filters: $filters, pagination: $pagination, sortings: $sortings) {
          items {
            name
            value
          }
        }
      }
    `,
    variables: {
      filters: [
        {
          name: 'category',
          operator: 'eq',
          value: INTEGRATION_MODELLER_SETTING_CATEGORY
        }
      ],
      pagination: { page: 1, limit: 100 },
      sortings: []
    }
  })

  return response?.data?.responses?.items
}
