import { CALL_API, Schemas } from '../Middleware/api'

//
// CLASS
//

export const loadStudents = (id) => (dispatch, getState) => dispatch(fetchStudents(id))

export const STUDENTS_REQUEST = 'STUDENTS_REQUEST'
export const STUDENTS_SUCCESS = 'STUDENTS_SUCCESS'
export const STUDENTS_FAILURE = 'STUDENTS_FAILURE'

export const fetchStudents = (id) => ({
  [CALL_API]: {
    api: 'accounts',
    endpoint: `auth/class/${id}/students`,
    method: 'GET',
    types: [ STUDENTS_REQUEST, STUDENTS_SUCCESS, STUDENTS_FAILURE ],
    schema: Schemas.STUDENTS
  }
})

//
// ROOTS
//

export const loadRoots = () => (dispatch, getState) => dispatch(fetchRoots())

export const ROOTS_REQUEST = 'ROOTS_REQUEST'
export const ROOTS_SUCCESS = 'ROOTS_SUCCESS'
export const ROOTS_FAILURE = 'ROOTS_FAILURE'

export const fetchRoots = () => ({
  [CALL_API]: {
    api: 'curriculum',
    endpoint: 'roots',
    method: 'GET',    
    types: [ ROOTS_REQUEST, ROOTS_SUCCESS, ROOTS_FAILURE ],
    schema: Schemas.ROOT_ARRAY
  }
})

//
// WORDS
//

export const loadWords = () => (dispatch, getState) => dispatch(fetchWords())

export const WORDS_REQUEST = 'WORDS_REQUEST'
export const WORDS_SUCCESS = 'WORDS_SUCCESS'
export const WORDS_FAILURE = 'WORDS_FAILURE'

export const fetchWords = () => ({
  [CALL_API]: {
    api: 'curriculum',
    endpoint: 'words',
    method: 'GET',    
    types: [ WORDS_REQUEST, WORDS_SUCCESS, WORDS_FAILURE ],
    schema: Schemas.WORD_ARRAY
  }
})

export const loadRelatedWords = (data) => (dispatch, getState) => dispatch(fetchRelatedWords(data))

export const RELATED_WORDS_REQUEST = 'RELATED_WORDS_REQUEST'
export const RELATED_WORDS_SUCCESS = 'RELATED_WORDS_SUCCESS'
export const RELATED_WORDS_FAILURE = 'RELATED_WORDS_FAILURE'

export const fetchRelatedWords = data => ({
  [CALL_API]: {
    api: 'curriculum',
    endpoint: `related-words?words=${data.join(',')}`,
    method: 'GET',    
    types: [ RELATED_WORDS_REQUEST, RELATED_WORDS_SUCCESS, RELATED_WORDS_FAILURE ],
    schema: Schemas.RELATED_WORDS_ARRAY
  }
})

//
// WORD LISTS
//

export const loadWordLists = (id = null) => (dispatch, getState) => dispatch(fetchWordLists(id))

export const WORD_LISTS_REQUEST = 'WORD_LISTS_REQUEST'
export const WORD_LISTS_SUCCESS = 'WORD_LISTS_SUCCESS'
export const WORD_LISTS_FAILURE = 'WORD_LISTS_FAILURE'

export const fetchWordLists = (id) => ({
  [CALL_API]: {
    api: 'curriculum',
    endpoint: id ? `word-lists/${id}` : 'word-lists',
    method: 'GET',    
    types: [ WORD_LISTS_REQUEST, WORD_LISTS_SUCCESS, WORD_LISTS_FAILURE ],
    schema: id ? Schemas.WORD_LIST : Schemas.WORD_LIST_ARRAY
  }
})

export const CREATE_WORD_LIST_REQUEST = 'CREATE_WORD_LIST_REQUEST'
export const CREATE_WORD_LIST_SUCCESS = 'CREATE_WORD_LIST_SUCCESS'
export const CREATE_WORD_LIST_FAILURE = 'CREATE_WORD_LIST_FAILURE'

export const createAndLoadWordList = (data, session) => (dispatch, getState) => dispatch(createWordList(data, session))

export const createWordList = (data, session) => ({
  [CALL_API]: {
    api: 'curriculum',
    data: data,
    endpoint: `admin/word-lists?x_key=${session.user}&access_token=${session.token}`,
    method: 'POST',    
    types: [ CREATE_WORD_LIST_REQUEST, CREATE_WORD_LIST_SUCCESS, CREATE_WORD_LIST_FAILURE ],
    schema: Schemas.WORD_LIST
  }
})

export const DELETE_WORD_LIST_REQUEST = 'DELETE_WORD_LIST_REQUEST'
export const DELETE_WORD_LIST_SUCCESS = 'DELETE_WORD_LIST_SUCCESS'
export const DELETE_WORD_LIST_FAILURE = 'DELETE_WORD_LIST_FAILURE'

export const deleteAndRemoveWordList = (id, session) => (dispatch, getState) => dispatch(deleteWordList(id, session))

export const deleteWordList = (id, session) => ({
  [CALL_API]: {
    api: 'curriculum',
    endpoint: `admin/word-lists/${id}?x_key=${session.user}&access_token=${session.token}`,
    method: 'DELETE',    
    types: [ DELETE_WORD_LIST_REQUEST, DELETE_WORD_LIST_SUCCESS, DELETE_WORD_LIST_FAILURE ],
    schema: Schemas.WORD_LIST
  }
})

export const UPDATE_WORD_LIST_REQUEST = 'UPDATE_WORD_LIST_REQUEST'
export const UPDATE_WORD_LIST_SUCCESS = 'UPDATE_WORD_LIST_SUCCESS'
export const UPDATE_WORD_LIST_FAILURE = 'UPDATE_WORD_LIST_FAILURE'

export const updateAndLoadWordList = (data, id, session) => (dispatch, getState) => dispatch(updateWordList(data, id, session))

export const updateWordList = (data, id, session) => ({
  [CALL_API]: {
    api: 'curriculum',
    data: data,
    endpoint: `admin/word-lists/${id}?x_key=${session.user}&access_token=${session.token}`,
    method: 'PATCH',
    types: [ UPDATE_WORD_LIST_REQUEST, UPDATE_WORD_LIST_SUCCESS, UPDATE_WORD_LIST_FAILURE ],
    schema: Schemas.WORD_LIST
  }
})

//
// LEADERBOARDS
//

export const loadLeaderboards = query => (dispatch, getState) => dispatch(fetchLeaderboards(query))

export const LEADERBOARDS_REQUEST = 'LEADERBOARDS_REQUEST'
export const LEADERBOARDS_SUCCESS = 'LEADERBOARDS_SUCCESS'
export const LEADERBOARDS_FAILURE = 'LEADERBOARDS_FAILURE'

export const fetchLeaderboards = query => ({
  [CALL_API]: {
    api: 'accounts',
    endpoint: `auth/leaderboard?${query}`,
    method: 'GET',    
    types: [ LEADERBOARDS_REQUEST, LEADERBOARDS_SUCCESS, LEADERBOARDS_FAILURE ],
    schema: Schemas.LEADERBOARDS
  }
})

//
// LESSONS
//

export const loadLessons = (id = null) => (dispatch, getState) => dispatch(fetchLessons(id))

export const LESSONS_REQUEST = 'LESSONS_REQUEST'
export const LESSONS_SUCCESS = 'LESSONS_SUCCESS'
export const LESSONS_FAILURE = 'LESSONS_FAILURE'

export const fetchLessons = (id) => ({
  [CALL_API]: {
    api: 'accounts',
    endpoint: id ? `lesson/${id}` : 'lesson',
    method: 'GET',    
    types: [ LESSONS_REQUEST, LESSONS_SUCCESS, LESSONS_FAILURE ],
    schema: id ? Schemas.LESSON : Schemas.LESSON_ARRAY
  }
})

export const CREATE_LESSON_REQUEST = 'CREATE_LESSON_REQUEST'
export const CREATE_LESSON_SUCCESS = 'CREATE_LESSON_SUCCESS'
export const CREATE_LESSON_FAILURE = 'CREATE_LESSON_FAILURE'

export const createAndLoadLesson = (data, session) => (dispatch, getState) => dispatch(createLesson(data, session))

export const createLesson = (data, session) => ({
  [CALL_API]: {
    api: 'accounts',
    data: data,
    endpoint: `admin/lesson?x_key=${session.user}&access_token=${session.token}`,
    method: 'POST',    
    types: [ CREATE_LESSON_REQUEST, CREATE_LESSON_SUCCESS, CREATE_LESSON_FAILURE ],
    schema: Schemas.LESSON
  }
})

export const DELETE_LESSON_REQUEST = 'DELETE_LESSON_REQUEST'
export const DELETE_LESSON_SUCCESS = 'DELETE_LESSON_SUCCESS'
export const DELETE_LESSON_FAILURE = 'DELETE_LESSON_FAILURE'

export const deleteAndRemoveLesson = (id, session) => (dispatch, getState) => dispatch(deleteLesson(id, session))

export const deleteLesson = (id, session) => ({
  [CALL_API]: {
    api: 'accounts',
    endpoint: `admin/lesson/${id}?x_key=${session.user}&access_token=${session.token}`,
    method: 'DELETE',    
    types: [ DELETE_LESSON_REQUEST, DELETE_LESSON_SUCCESS, DELETE_LESSON_FAILURE ],
    schema: Schemas.LESSON
  }
})

export const UPDATE_LESSON_REQUEST = 'UPDATE_LESSON_REQUEST'
export const UPDATE_LESSON_SUCCESS = 'UPDATE_LESSON_SUCCESS'
export const UPDATE_LESSON_FAILURE = 'UPDATE_LESSON_FAILURE'

export const updateAndLoadLesson = (data, id, session) => (dispatch, getState) => dispatch(updateLesson(data, id, session))

export const updateLesson = (data, id, session) => ({
  [CALL_API]: {
    api: 'accounts',
    data: data,
    endpoint: `admin/lesson/${id}?x_key=${session.user}&access_token=${session.token}`,
    method: 'PATCH',
    types: [ UPDATE_LESSON_REQUEST, UPDATE_LESSON_SUCCESS, UPDATE_LESSON_FAILURE ],
    schema: Schemas.LESSON
  }
})

//
// USER
//

export const loadUser = (id, updateState = true) => (dispatch, getState) => dispatch(fetchUser(id, updateState))

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

export const fetchUser = (id, updateState) => ({
  [CALL_API]: {
    api: 'accounts',
    endpoint: `auth/user/${id}`,
    method: 'GET',
    schema: Schemas.USER,
    types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ]    
  },
  updateState: updateState
})


export const login = data => (dispatch, getState) => dispatch(loginUser(data))

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const loginUser = data => ({
  [CALL_API]: {
    api: 'accounts',
    data: data,
    endpoint: 'login',
    method: 'POST',
    schema: Schemas.SESSION,
    types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ]
  }
})


export const LOGOUT_USER = 'LOGOUT_USER'

export const logoutUser = () => ({
  type: LOGOUT_USER,
  response: { remove: ['session', 'user', 'students', 'ranks'] }
})


export const ACTIVATE_SESSION = 'ACTIVATE_SESSION'

export const activateSession = session => ({
  type: ACTIVATE_SESSION,
  response: { entities: { session } }
})


//
// ETC
//

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE
})

export const REMOVE_ENTITY = 'REMOVE_ENTITY'

// Resets the currently visible error message.
export const removeEntity = (entity) => ({
  type: REMOVE_ENTITY,
  response: { remove: entity }
})
