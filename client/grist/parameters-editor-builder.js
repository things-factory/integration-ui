/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin'
import { store } from '@things-factory/shell'
import '@things-factory/board-ui/client/board-modeller/editors/things-editor-property'

/**
모든 에디터들은 change 이벤트를 지원해야 한다. 또한, 모든 에디터들은 value속성에 값을 가져야 한다.

Example:

    <parameters-editor-builder value="{{value}}">
      <label>Center X</label>
      <input type="number" .value="${value.cx}">
      <label>Width</label>
      <input type="number" .value="${value.width}">
    </parameters-editor-builder>
*/

const DEFAULT_VALUE = {
  legend: '',
  number: 0,
  angle: 0,
  string: '',
  text: '',
  textarea: '',
  checkbox: false,
  select: '',
  color: '#000000',
  'solidcolor-stops': null,
  'gradientcolor-stops': null,
  'gltf-selector': '',
  'image-selector': '',
  multiplecolor: null,
  editortable: null,
  imageselector: '',
  options: null,
  date: null
}

class ParametersEditorBuilder extends connect(store)(LitElement) {
  static get properties() {
    return {
      value: Object,
      props: Array,
      propertyEditor: Object
    }
  }

  constructor() {
    super()

    this.props = []
  }

  firstUpdated() {
    this.renderRoot.addEventListener('change', this._onValueChanged.bind(this))
  }

  updated(change) {
    change.has('props') && this._onPropsChanged(this.props)
    change.has('value') && this._setValues()
  }

  stateChanged(state) {
    this.propertyEditor = state.board.editors
  }

  _onPropsChanged(props) {
    this.renderRoot.textContent = ''
    ;(props || []).forEach(prop => {
      let elementType = this.propertyEditor[prop.type]
      if (!elementType) {
        console.warn('Property Editor not defined', prop.type)
        return
      }
      let element = document.createElement(elementType)

      element.label = prop.label
      element.type = prop.type
      element.placeholder = prop.placeholder
      element.setAttribute('name', prop.name)
      prop.placeholder = prop.placeholder
      if (prop.observe) {
        element.observe = prop.observe
      }
      element.property = prop.property
      element.setAttribute('property-editor', true)

      this.renderRoot.appendChild(element)
    })
  }

  _setValues() {
    var value = this.value || {}
    Array.from(this.renderRoot.querySelectorAll('[name]')).forEach(prop => {
      let name = prop.getAttribute('name')
      prop.value = value[name] === undefined ? DEFAULT_VALUE[prop.type] : value[name]
    })
  }

  _getValues() {
    var value = {}
    Array.from(this.renderRoot.querySelectorAll('[name]')).forEach(prop => {
      let name = prop.getAttribute('name')
      value[name] = prop.value === undefined ? DEFAULT_VALUE[prop.type] : prop.value
    })
    return value
  }

  _onValueChanged(e) {
    e.stopPropagation()
    var prop = e.target

    while (prop && !prop.hasAttribute('property-editor')) {
      prop = prop.parentNode
    }

    if (!prop || !prop.hasAttribute('property-editor')) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('property-change', {
        bubbles: true,
        composed: true,
        detail: this._getValues()
      })
    )
  }
}

customElements.define('parameters-editor-builder', ParametersEditorBuilder)
