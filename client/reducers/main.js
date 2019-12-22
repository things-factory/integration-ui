import { UPDATE_INTEGRATION_SERVICE } from '../actions/main'

const INITIAL_STATE = {
  integrationService: 'ABC'
}

const integrationService = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_INTEGRATION_SERVICE:
      return { ...state }

    default:
      return state
  }
}

export default integrationService
