import '@things-factory/grist-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'
import { client, PageView, store } from '@things-factory/shell'
import { ScrollbarStyles } from '@things-factory/styles'
import { isMobileDevice, gqlBuilder } from '@things-factory/utils'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin'
import moment from 'moment-timezone'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import './scenario-detail'

export class Scenario extends connect(store)(localize(i18next)(PageView)) {
  static get properties() {
    return {
      active: String,
      searchConfig: Array,
      gristConfig: Object
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        search-form {
          overflow: visible;
        }

        data-grist {
          overflow-y: auto;
          flex: 1;
        }
      `
    ]
  }

  get context() {
    return {
      title: i18next.t('text.scenario list'),
      actions: [
        {
          title: i18next.t('button.start monitor'),
          action: this.startSubscribe.bind(this)
        },
        {
          title: i18next.t('button.stop monitor'),
          action: this.stopSubscribe.bind(this)
        },
        {
          title: i18next.t('button.save'),
          action: this._updateScenario.bind(this)
        },
        {
          title: i18next.t('button.delete'),
          action: this._deleteScenario.bind(this)
        }
      ]
    }
  }

  render() {
    return html`
      <search-form
        id="search-form"
        .fields=${this.searchConfig}
        @submit=${async () => this.dataGrist.fetch()}
      ></search-form>

      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.gristConfig}
        .fetchHandler=${this.fetchHandler.bind(this)}
      ></data-grist>
    `
  }

  get searchForm() {
    return this.shadowRoot.querySelector('search-form')
  }

  get dataGrist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  async pageInitialized() {
    this.searchConfig = [
      {
        name: 'name',
        type: 'text',
        props: {
          placeholder: i18next.t('field.name'),
          searchOper: 'like'
        }
      },
      {
        name: 'description',
        type: 'text',
        props: {
          placeholder: i18next.t('field.description'),
          searchOper: 'like'
        }
      }
    ]

    this.gristConfig = {
      list: { fields: ['name', 'description', 'status'] },
      columns: [
        { type: 'gutter', gutterName: 'sequence' },
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        {
          type: 'object',
          name: 'domain',
          hidden: true
        },
        {
          type: 'gutter',
          gutterName: 'button',
          name: 'status',
          icon: record => (!record ? 'play_arrow' : record.status == 1 ? 'pause' : 'play_arrow'),
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              if (!record || !record.name) {
                /* TODO record가 새로 추가된 것이면 리턴하도록 한다. */
                return
              }
              if (record.status == 0) {
                this.startScenario(record)
              } else {
                this.stopScenario(record)
              }
            }
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'reorder',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              if (!record.id) return
              openPopup(
                html`
                  <scenario-detail .scenario=${record}></scenario-detail>
                `,
                {
                  backdrop: true,
                  size: 'large',
                  title: i18next.t('title.scenario-detail')
                }
              )
            }
          }
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            editable: true
          },
          width: 150
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            editable: true
          },
          width: 200
        },
        {
          type: 'crontab',
          name: 'schedule',
          header: i18next.t('field.schedule'),
          record: {
            align: 'center',
            editable: true
          },
          width: 80
        },
        {
          type: 'select',
          name: 'timezone',
          header: i18next.t('field.timezone'),
          record: {
            align: 'center',
            editable: true,
            options: ['', ...moment.tz.names()]
          },
          width: 120
        },
        {
          type: 'checkbox',
          name: 'active',
          header: i18next.t('field.active'),
          record: {
            align: 'center',
            editable: true
          },
          width: 60
        },
        {
          type: 'progress',
          name: 'progress',
          header: i18next.t('field.progress'),
          record: {
            editable: false
          },
          width: 80
        },
        {
          type: 'number',
          name: 'rounds',
          header: i18next.t('field.rounds'),
          record: {
            editable: false,
            align: 'right'
          },
          width: 60
        },
        {
          type: 'string',
          name: 'message',
          header: i18next.t('field.message'),
          record: {
            editable: false
          },
          width: 220
        },
        {
          type: 'object',
          name: 'updater',
          header: i18next.t('field.updater'),
          record: {
            editable: false
          },
          width: 120
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          record: {
            editable: false
          },
          width: 180
        }
      ],
      rows: {
        selectable: {
          multiple: true
        }
      }
    }

    await this.updateComplete

    this.dataGrist.fetch()
  }

  async pageUpdated(changes, lifecycle) {
    if (this.active) {
      await this.updateComplete

      this.dataGrist.fetch()
    }

    if ('active' in changes) {
      if (!this.active) {
        console.log('stopSubscribe')
        this.stopSubscribe()
      }
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          responses: scenarios(${gqlBuilder.buildArgs({
            filters: this._conditionParser(),
            pagination: { page, limit },
            sortings: sorters
          })}) {
            items {
              id
              domain {
                id
                name
                description
              }
              name
              description
              active
              status
              schedule
              timezone
              updater {
                id
                name
                description
              }
              updatedAt
            }
            total
          }
        }
      `
    })

    return {
      total: response.data.responses.total || 0,
      records: response.data.responses.items || []
    }
  }

  _conditionParser() {
    return this.searchForm
      .getFields()
      .filter(field => (field.type !== 'checkbox' && field.value && field.value !== '') || field.type === 'checkbox')
      .map(field => {
        return {
          name: field.name,
          value:
            field.type === 'text'
              ? field.value
              : field.type === 'checkbox'
              ? field.checked
              : field.type === 'number'
              ? parseFloat(field.value)
              : field.value,
          operator: field.getAttribute('searchOper')
        }
      })
  }

  async _deleteScenario() {
    if (confirm(i18next.t('text.sure_to_x', { x: i18next.t('text.delete') }))) {
      const ids = this.dataGrist.selected.map(record => record.id)
      if (ids && ids.length > 0) {
        const response = await client.query({
          query: gql`
            mutation {
              deleteScenarios(${gqlBuilder.buildArgs({ ids })})
            }
          `
        })

        if (!response.errors) {
          this.dataGrist.fetch()
          await document.dispatchEvent(
            new CustomEvent('notify', {
              detail: {
                message: i18next.t('text.info_delete_successfully', { x: i18next.t('text.delete') })
              }
            })
          )
        }
      }
    }
  }

  async stateChanged(state) {
    if (this.active && this._currentPopupName && !state.layout.viewparts[this._currentPopupName]) {
      this.dataGrist.fetch()
      this._currentPopupName = null
    }
  }

  async _updateScenario() {
    let patches = this.dataGrist.dirtyRecords
    if (patches && patches.length) {
      patches = patches.map(patch => {
        let patchField = patch.id ? { id: patch.id } : {}
        const dirtyFields = patch.__dirtyfields__
        for (let key in dirtyFields) {
          if (['message', 'step', 'steps', 'progress', 'rounds'].indexOf(key) == -1) {
            patchField[key] = dirtyFields[key].after
          }
        }
        patchField.cuFlag = patch.__dirty__

        return patchField
      })

      const response = await client.query({
        query: gql`
            mutation {
              updateMultipleScenario(${gqlBuilder.buildArgs({
                patches
              })}) {
                name
              }
            }
          `
      })

      if (!response.errors) this.dataGrist.fetch()
    }
  }

  async startSubscribe() {
    this.client = new SubscriptionClient(`ws://${location.host}/subscriptions`, {
      reconnect: true
    })

    this.client.onError(() => {
      var client = this.client
      //readyState === 3 인 경우 url을 잘 못 입력했거나, 서버에 문제가 있는 경우이므로 reconnect = false로 변경한다.
      if (client.status === 3) {
        client.reconnect = false
      }
    })

    this.client.onConnected(() => {
      this.subscription = this.client
        .request({
          query: `
      subscription {
        scenarioState{
          name
          state
          progress {
            rate
            steps
            step
            rounds
          }
          message
        }
      }
      `
        })
        .subscribe({
          next: ({ data }) => {
            if (data) {
              var {
                name,
                state,
                progress: { rate, steps, step, rounds },
                message
              } = data.scenarioState
            }

            var { records } = this.dataGrist.dirtyData
            var record = records && records.find(record => record.name === name)

            if (record) {
              record.progress = rate
              record.steps = steps
              record.step = step
              record.rounds = rounds
              record.message = message

              this.dataGrist.refresh()
            }
          }
        })
    })
  }

  async stopSubscribe() {
    if (this.client) {
      this.client.unsubscribeAll()
      this.client.close(true)
      delete this.client
    }
  }

  async startScenario(record) {
    var response = await client.mutate({
      mutation: gql`
        mutation($name: String!) {
          startScenario(name: $name) {
            status
          }
        }
      `,
      variables: {
        name: record.name
      }
    })

    var status = response.data.startScenario.status

    record.status = status

    this.dataGrist.refresh()

    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          level: 'info',
          message: `${status ? 'success' : 'fail'} to start scenario : ${record.name}`
        }
      })
    )
  }

  async stopScenario(record) {
    var response = await client.mutate({
      mutation: gql`
        mutation($name: String!) {
          stopScenario(name: $name) {
            status
          }
        }
      `,
      variables: {
        name: record.name
      }
    })

    var status = response.data.stopScenario.status

    record.status = status

    this.dataGrist.refresh()

    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          level: 'info',
          message: `${status ? 'fail' : 'success'} to stop scenario : ${record.name}`
        }
      })
    )
  }
}

window.customElements.define('scenario-page', Scenario)
