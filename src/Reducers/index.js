import * as ActionTypes from '../Actions'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import _ from 'underscore';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {}, action) => {
  const response = action.response

  if (response) {
    const [remove, entities] = [response.remove, response.entities]

    if (remove) {
      return _.omit(state, remove) 
    }

    if (entities) {
      return merge({}, state, entities)
    }
  }

  return state
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  }

  if (error) {
    return error
  }

  return state
}

const rootReducer = combineReducers({
  entities,
  errorMessage
})

export default rootReducer
