import * as ActionTypes from '../Actions'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import _ from 'underscore';

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {}, action) => {
  if (!action.response) {
    return state;
  }

  const {
    remove,
    entities,
    update
  } = action.response;

  if (remove) {
    
    if (_.isString(remove) || _.isArray(remove)) { // Removes matching keys from state tree
      return _.omit(state, remove)
    }

    if (_.isObject(remove)) { // For matching keys remove matching ids
      return _.mapObject(state, (v, k) => remove[k] ? _.omit(v, remove[k]) : v)
    }

  } else if (update) {

    console.log(state)
    console.log(update)
    return _.extend(state, update)

  } else if (entities) {

    return merge({}, state, entities)

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
