import { normalize, schema, arrayOf } from 'normalizr'

const API_ROOT = 'https://rocky-garden-48841.herokuapp.com/api/v2/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  console.log(fullUrl)

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => {
        return response.ok
          ? Object.assign({},normalize(json, schema))
          : Promise.reject(json)
      })
    )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where models are placed in `entities`, and nested
// JSON objects are replaced with their IDs

const wordSchema = new schema.Entity('words', {}, { idAttribute: '_id' })

// Schemas for API responses.
export const Schemas = {
  WORD: wordSchema,
  WORD_ARRAY: [wordSchema]
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function')                 { endpoint = endpoint(store.getState()) }
  if (typeof endpoint !== 'string')                   { throw new Error('Specify a string endpoint URL.') }
  if (!schema)                                        { throw new Error('Specify one of the exported Schemas.') }
  if (!Array.isArray(types) || types.length !== 3)    { throw new Error('Expected an array of three action types.') }
  if (!types.every(type => typeof type === 'string')) { throw new Error('Expected action types to be strings.') }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.error || 'Something bad happened'
    }))
  )
}
