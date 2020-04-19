/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { html, css } from 'lit-element'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/modeller-ui'

import './things-editor-http-headers'
import './things-editor-http-parameters'
import './things-editor-http-body'

export class PropertyEditorHttpHeaders extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-http-headers
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-http-headers>
    `
  }
}

customElements.define('property-editor-http-headers', PropertyEditorHttpHeaders)

export class PropertyEditorHttpParameters extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-http-parameters
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-http-parameters>
    `
  }
}

customElements.define('property-editor-http-parameters', PropertyEditorHttpParameters)

export class PropertyEditorHttpBody extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-http-body
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-http-body>
    `
  }
}

customElements.define('property-editor-http-body', PropertyEditorHttpBody)
