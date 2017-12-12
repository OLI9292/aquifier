import { CALL_API, Schemas } from '../Middleware/api'

export const WORDS_REQUEST = 'WORDS_REQUEST'
export const WORDS_SUCCESS = 'WORDS_SUCCESS'
export const WORDS_FAILURE = 'WORDS_FAILURE'

export const fetchWords = (id = null) => ({
  [CALL_API]: {
    types: [ WORDS_REQUEST, WORDS_REQUEST, WORDS_REQUEST ],
    endpoint: id ? `words/${id}` : 'words',
    schema: id ? Schemas.WORD : Schemas.WORD_ARRAY
  }
})

export const loadWords = (id) => (dispatch, getState) => {
  return dispatch(fetchWords(id))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})
