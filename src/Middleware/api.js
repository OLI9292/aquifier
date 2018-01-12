import { normalize, schema } from 'normalizr'
import _ from 'underscore';

const API_ROOT = {
  'accounts': 'https://dry-ocean-39738.herokuapp.com/api/v2/',
  'curriculum': 'https://rocky-garden-48841.herokuapp.com/api/v2/'
}

const formatSession = session => session ? {
  'access-token': session.token,
  'key': session.user,
  'session': session.sessionId
} : {};

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (api, endpoint, schema, method, data, session) => {
  const fullUrl = API_ROOT[api] + endpoint
  const headers = _.extend({}, { 'Content-Type': 'application/json' }, formatSession(session));
  const body = { method: method, body: JSON.stringify(data), headers: headers };
  console.log(`method: ${method}\napi: ${api}\nendpoint: ${endpoint}\nheaders: ${JSON.stringify(headers)}`)

  return fetch(fullUrl, body)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) { return Promise.reject(json) }
        const normalized = Object.assign({},normalize(json, schema))
        // Removes undefined keys
        normalized.entities = _.mapObject(normalized.entities, (v, k) => v.undefined ? v.undefined : v )
        return normalized
      })
    )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where models are placed in `entities`, and nested
// JSON objects are replaced with their IDs

const successSchema = new schema.Entity('Success')

// CURRICULUM
const wordSchema = new schema.Entity('words', {}, { idAttribute: '_id' })
const rootSchema = new schema.Entity('roots', {}, { idAttribute: '_id' })
const wordListSchema = new schema.Entity('wordLists', {}, { idAttribute: '_id' })
const lessonSchema = new schema.Entity('lessons', {}, { idAttribute: '_id' })
const relatedWordSchema = new schema.Entity('relatedWords', {}, { idAttribute: 'word' })
const rankSchema = new schema.Entity('ranks')

// ACCOUNTS
const userSchema = new schema.Entity('user', {}, { idAttribute: '_id' })
const sessionSchema = new schema.Entity('session', { user: userSchema })
const studentsSchema = new schema.Entity('students', { students: [userSchema] })

// Schemas for API responses.
export const Schemas = {
  WORD: wordSchema,
  WORD_ARRAY: [wordSchema],
  WORD_LIST: wordListSchema,
  WORD_LIST_ARRAY: [wordListSchema],
  LESSON: lessonSchema,
  LESSON_ARRAY: [lessonSchema],
  USER: userSchema,
  ROOT_ARRAY: [rootSchema],
  SESSION: sessionSchema,
  STUDENTS: studentsSchema,
  LEADERBOARDS: [rankSchema],
  RELATED_WORDS_ARRAY: [relatedWordSchema],
  SUCCESS: successSchema
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
  const { api, schema, types, method, data, session } = callAPI

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

  return callApi(api, endpoint, schema, method, data, session).then(
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
