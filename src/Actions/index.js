import { CALL_API, Schemas } from '../Middleware/api'

export const loadWords = (id) => (dispatch, getState) => dispatch(fetchWords(id))

export const WORDS_REQUEST = 'WORDS_REQUEST'
export const WORDS_SUCCESS = 'WORDS_SUCCESS'
export const WORDS_FAILURE = 'WORDS_FAILURE'

export const fetchWords = (id = null) => ({
  [CALL_API]: {
    api: 'curriculum',
    types: [ WORDS_REQUEST, WORDS_REQUEST, WORDS_REQUEST ],
    endpoint: id ? `words/${id}` : 'words',
    schema: id ? Schemas.WORD : Schemas.WORD_ARRAY
  }
})


export const login = data => (dispatch, getState) => dispatch(loginUser(data))

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const loginUser = data => ({
  [CALL_API]: {
    api: 'accounts',
    types: [ LOGIN_REQUEST, LOGIN_REQUEST, LOGIN_REQUEST ],
    endpoint: 'login',
    schema: Schemas.SESSION,
    method: 'POST',
    data: data
  }
})

export const LOGOUT_USER = 'LOGOUT_USER'

export const logoutUser = () => ({
  type: LOGOUT_USER,
  response: { remove: 'session' }
})


export const ACTIVATE_SESSION = 'ACTIVATE_SESSION'

export const activateSession = session => ({
  type: ACTIVATE_SESSION,
  response: { entities: { session } }
})


export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE
})
