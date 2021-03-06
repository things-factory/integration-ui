import '@things-factory/grist-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { client, PageView, store } from '@things-factory/shell'
import { gqlBuilder, isMobileDevice } from '@things-factory/utils'
import { ScrollbarStyles } from '@things-factory/styles'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin'

export class Connection extends connect(store)(localize(i18next)(PageView)) {
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
      title: i18next.t('text.connection list'),
      actions: [
        {
          title: i18next.t('button.save'),
          action: this._updateConnections.bind(this)
        },
        {
          title: i18next.t('button.delete'),
          action: this._deleteConnections.bind(this)
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
      },
      {
        name: 'type',
        type: 'text',
        props: {
          placeholder: i18next.t('field.type'),
          searchOper: 'like'
        }
      },
      {
        name: 'endpoint',
        type: 'text',
        props: {
          placeholder: i18next.t('field.endpoint'),
          searchOper: 'like'
        }
      }
    ]

    this.gristConfig = {
      list: { fields: ['name', 'description', 'type'] },
      columns: [
        { type: 'gutter', gutterName: 'sequence' },
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        {
          type: 'gutter',
          gutterName: 'button',
          name: 'status',
          icon: record => (!record ? 'link' : record.status == 1 ? 'link_off' : 'link'),
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              if (!record || !record.name || record.__dirty__ == '+') {
                return
              }
              if (record.status == 0) {
                this.connect(record)
              } else {
                this.disconnect(record)
              }
            }
          }
        },
        {
          type: 'object',
          name: 'domain',
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            editable: true
          },
          sortable: true,
          width: 150,
          validation: function (after, before, record, column) {
            /* connected 상태에서는 이름을 바꿀 수 없다. */
            if (record.status) {
              document.dispatchEvent(
                new CustomEvent('notify', {
                  detail: {
                    level: 'warn',
                    message: 'connection name cannot be changed during connected.'
                  }
                })
              )
              return false
            }
            return true
          }
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
          type: 'checkbox',
          name: 'active',
          header: i18next.t('field.active'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 60
        },
        {
          type: 'connector',
          name: 'type',
          header: i18next.t('field.type'),
          record: {
            editable: true
          },
          sortable: true,
          width: 200
        },
        {
          type: 'string',
          name: 'endpoint',
          header: i18next.t('field.endpoint'),
          record: {
            editable: true
          },
          sortable: true,
          width: 200
        },
        {
          type: 'parameters',
          name: 'params',
          header: i18next.t('field.params'),
          record: {
            editable: true,
            options: async (value, column, record, row, field) => {
              var type = record.type

              if (!type) {
                return []
              }

              var connector = await this.fetchConnector(type)
              return connector.parameterSpec
            }
          },
          width: 100
        },
        {
          type: 'object',
          name: 'updater',
          header: i18next.t('field.updater'),
          record: {
            editable: false
          },
          sortable: true,
          width: 120
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          record: {
            editable: false
          },
          sortable: true,
          width: 180
        }
      ],
      rows: {
        selectable: {
          multiple: true
        }
      },
      sorters: [
        {
          name: 'name'
        }
      ]
    }

    await this.updateComplete

    this.dataGrist.fetch()
  }

  async pageUpdated(changes, lifecycle) {
    if (this.active) {
      await this.updateComplete

      this.dataGrist.fetch()
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query($filters: [Filter], $pagination: Pagination, $sortings: [Sorting]) {
          responses: connections(filters: $filters, pagination: $pagination, sortings: $sortings) {
            items {
              id
              domain {
                id
                name
                description
              }
              name
              description
              type
              endpoint
              active
              status
              params
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
      `,
      variables: {
        filters: this._conditionParser(),
        pagination: { page, limit },
        sortings: sorters
      }
    })

    return {
      total: response.data.responses.total || 0,
      records: response.data.responses.items || []
    }
  }

  async fetchConnector(name) {
    const response = await client.query({
      query: gql`
        query($name: String!) {
          connector(name: $name) {
            name
            description
            parameterSpec {
              type
              name
              label
              placeholder
              property
            }
          }
        }
      `,
      variables: {
        name
      }
    })

    return response.data.connector
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

  async _deleteConnections(name) {
    if (
      confirm(
        i18next.t('text.sure_to_x', {
          x: i18next.t('text.delete')
        })
      )
    ) {
      const names = this.dataGrist.selected.map(record => record.name)
      if (names && names.length > 0) {
        const response = await client.mutate({
          mutation: gql`
            mutation($names: [String]!) {
              deleteConnections(names: $names)
            }
          `,
          variables: {
            names
          }
        })

        if (!response.errors) {
          this.dataGrist.fetch()
          await document.dispatchEvent(
            new CustomEvent('notify', {
              detail: {
                message: i18next.t('text.info_x_successfully', {
                  x: i18next.t('text.delete')
                })
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

  async _updateConnections() {
    let patches = this.dataGrist.dirtyRecords
    if (patches && patches.length) {
      patches = patches.map(connection => {
        let patchField = connection.id ? { id: connection.id } : {}
        const dirtyFields = connection.__dirtyfields__
        for (let key in dirtyFields) {
          patchField[key] = dirtyFields[key].after
        }
        patchField.cuFlag = connection.__dirty__

        return patchField
      })

      const response = await client.mutate({
        mutation: gql`
          mutation($patches: [ConnectionPatch]!) {
            updateMultipleConnection(patches: $patches) {
              name
            }
          }
        `,
        variables: {
          patches
        }
      })

      if (!response.errors) this.dataGrist.fetch()
    }
  }

  async connect(record) {
    var response = await client.mutate({
      mutation: gql`
        mutation($name: String!) {
          connectConnection(name: $name) {
            status
          }
        }
      `,
      variables: {
        name: record.name
      }
    })

    var status = response.data.connectConnection.status

    record.status = status

    this.dataGrist.refresh()

    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          level: 'info',
          message: `${status ? 'success' : 'fail'} to connect : ${record.name}`
        }
      })
    )
  }

  async disconnect(record) {
    var response = await client.mutate({
      mutation: gql`
        mutation($name: String!) {
          disconnectConnection(name: $name) {
            status
          }
        }
      `,
      variables: {
        name: record.name
      }
    })

    var status = response.data.disconnectConnection.status

    record.status = status

    this.dataGrist.refresh()

    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          level: 'info',
          message: `${status ? 'fail' : 'success'} to disconnect : ${record.name}`
        }
      })
    )
  }
}

window.customElements.define('connection-page', Connection)
