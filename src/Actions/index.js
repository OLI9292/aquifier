import { CALL_API, Schemas } from '../Middleware/api'

//
// CLASS
//

export const fetchStudentsAction = classId => (dispatch, getState) => dispatch(fetchStudents(classId))

export const STUDENTS_REQUEST = 'STUDENTS_REQUEST'
export const STUDENTS_SUCCESS = 'STUDENTS_SUCCESS'
export const STUDENTS_FAILURE = 'STUDENTS_FAILURE'

export const fetchStudents = classId => ({
  [CALL_API]: {
    api: 'main',
    endpoint: `auth/class/${classId}/students`,
    method: 'GET',
    types: [ STUDENTS_REQUEST, STUDENTS_SUCCESS, STUDENTS_FAILURE ],
    schema: Schemas.STUDENT_ARRAY
  }
})

export const createClassAction = users => (dispatch, getState) => dispatch(createClass(users))

export const CLASS_REQUEST = 'CLASS_REQUEST'
export const CLASS_SUCCESS = 'CLASS_SUCCESS'
export const CLASS_FAILURE = 'CLASS_FAILURE'

export const createClass = users => ({
  [CALL_API]: {
    api: 'main',
    data: users,
    endpoint: 'auth/class?login=true',
    method: 'POST',
    types: [ CLASS_REQUEST, CLASS_SUCCESS, CLASS_FAILURE ],
    schema: Schemas.SESSION
  }
})


//
// QUESTION
//

export const saveQuestionAction = data => (dispatch, getState) => dispatch(saveQuestion(data))

export const QUESTIONS_REQUEST = 'QUESTIONS_REQUEST'
export const QUESTIONS_SUCCESS = 'QUESTIONS_SUCCESS'
export const QUESTIONS_FAILURE = 'QUESTIONS_FAILURE'

export const saveQuestion = data => ({
  [CALL_API]: {
    api: 'main',
    data: data,
    endpoint: 'auth/question',
    method: 'POST',
    types: [ QUESTIONS_REQUEST, QUESTIONS_SUCCESS, QUESTIONS_FAILURE ],
    schema: Schemas.SUCCESS
  }
})

export const fetchQuestionsAction = params => (dispatch, getState) => dispatch(fetchQuestions(params))

export const FETCH_QUESTIONS_REQUEST = 'FETCH_QUESTIONS_REQUEST'
export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS'
export const FETCH_QUESTIONS_FAILURE = 'FETCH_QUESTIONS_FAILURE'

export const fetchQuestions = params => ({
  [CALL_API]: {
    api: 'main',
    endpoint: 'question?' + params,
    method: 'GET',
    types: [ FETCH_QUESTIONS_REQUEST, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE ],
    schema: Schemas.QUESTION_ARRAY
  }
})

//
// LEVELS
//

export const fetchLevelsAction = () => (dispatch, getState) => dispatch(fetchLevels())

export const LEVEL_REQUEST = 'LEVEL_REQUEST'
export const LEVEL_SUCCESS = 'LEVEL_SUCCESS'
export const LEVEL_FAILURE = 'LEVEL_FAILURE'

export const fetchLevels = () => ({
  [CALL_API]: {
    api: 'main',
    endpoint: 'level',
    method: 'GET',
    schema: Schemas.LEVEL_ARRAY,
    types: [ LEVEL_REQUEST, LEVEL_SUCCESS, LEVEL_FAILURE ]    
  }
})

//
// ROOTS
//

export const fetchRootsAction = () => (dispatch, getState) => dispatch(fetchRoots())

export const ROOTS_REQUEST = 'ROOTS_REQUEST'
export const ROOTS_SUCCESS = 'ROOTS_SUCCESS'
export const ROOTS_FAILURE = 'ROOTS_FAILURE'

export const fetchRoots = () => ({
  [CALL_API]: {
    api: 'main',
    endpoint: 'roots',
    method: 'GET',    
    types: [ ROOTS_REQUEST, ROOTS_SUCCESS, ROOTS_FAILURE ],
    schema: Schemas.ROOT_ARRAY
  }
})

//
// FACTOIDS
//

export const fetchFactoidsAction = () => (dispatch, getState) => dispatch(fetchFactoids())

export const FACTOIDS_REQUEST = 'FACTOIDS_REQUEST'
export const FACTOIDS_SUCCESS = 'FACTOIDS_SUCCESS'
export const FACTOIDS_FAILURE = 'FACTOIDS_FAILURE'

export const fetchFactoids = () => ({
  [CALL_API]: {
    api: 'main',
    endpoint: 'factoids',
    method: 'GET',    
    types: [ FACTOIDS_REQUEST, FACTOIDS_SUCCESS, FACTOIDS_FAILURE ],
    schema: Schemas.FACTOID_ARRAY
  }
})

//
// WORDS
//

export const fetchWordsAction = () => (dispatch, getState) => dispatch(fetchWords())

export const WORDS_REQUEST = 'WORDS_REQUEST'
export const WORDS_SUCCESS = 'WORDS_SUCCESS'
export const WORDS_FAILURE = 'WORDS_FAILURE'

export const fetchWords = () => ({
  [CALL_API]: {
    api: 'main',
    endpoint: 'words',
    method: 'GET',    
    types: [ WORDS_REQUEST, WORDS_SUCCESS, WORDS_FAILURE ],
    schema: Schemas.WORD_ARRAY
  }
})

//
// LEADERBOARDS
//

export const fetchLeaderboardsAction = (query, session) => (dispatch, getState) => dispatch(fetchLeaderboards(query, session))

export const LEADERBOARDS_REQUEST = 'LEADERBOARDS_REQUEST'
export const LEADERBOARDS_SUCCESS = 'LEADERBOARDS_SUCCESS'
export const LEADERBOARDS_FAILURE = 'LEADERBOARDS_FAILURE'

export const fetchLeaderboards = (query, session) => ({
  [CALL_API]: {
    api: 'main',
    endpoint: `auth/leaderboard?${query}`,
    method: 'GET',    
    types: [ LEADERBOARDS_REQUEST, LEADERBOARDS_SUCCESS, LEADERBOARDS_FAILURE ],
    schema: Schemas.LEADERBOARDS,
    session: session
  }
})

//
// SCHOOL
//

export const fetchSchoolAction = id => (dispatch, getState) => dispatch(fetchSchool(id))

export const SCHOOL_REQUEST = 'SCHOOL_REQUEST'
export const SCHOOL_SUCCESS = 'SCHOOL_SUCCESS'
export const SCHOOL_FAILURE = 'SCHOOL_FAILURE'

export const fetchSchool = id => ({
  [CALL_API]: {
    api: 'main',
    endpoint: `auth/school/${id}`,
    method: 'GET',
    schema: Schemas.SCHOOL,
    types: [ SCHOOL_REQUEST, SCHOOL_SUCCESS, SCHOOL_FAILURE ]    
  }
})

//
// USER
//

export const fetchUserAction = (id, session, updateState = true) => (dispatch, getState) => dispatch(fetchUser(id, session, updateState))

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

export const fetchUser = (id, session, updateState) => ({
  [CALL_API]: {
    api: 'main',
    endpoint: `auth/user/${id}`,
    method: 'GET',
    session: session,
    schema: Schemas.USER,
    types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ]    
  },
  updateState: updateState
})

export const loginUserAction = data => (dispatch, getState) => dispatch(loginUser(data))

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const loginUser = data => ({
  [CALL_API]: {
    api: 'main',
    data: data,
    endpoint: 'login',
    method: 'POST',
    schema: Schemas.SESSION,
    types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ]
  }
})

export const saveStatsAction = (data, session) => (dispatch, getState) => dispatch(saveStats(data, session))

export const SAVE_STATS_REQUEST = 'SAVE_STATS_REQUEST'
export const SAVE_STATS_SUCCESS = 'SAVE_STATS_SUCCESS'
export const SAVE_STATS_FAILURE = 'SAVE_STATS_FAILURE'

export const saveStats = (data, session) => ({
  [CALL_API]: {
    api: 'main',
    data: data,
    endpoint: 'auth/user/stats',
    method: 'PATCH',
    session: session,
    schema: Schemas.USER,
    types: [ SAVE_STATS_REQUEST, SAVE_STATS_SUCCESS, SAVE_STATS_FAILURE ]
  }
})

export const saveLevelAction = (data, userId) => (dispatch, getState) => dispatch(saveLevel(data, userId))

export const SAVE_LEVEL_REQUEST = 'SAVE_LEVEL_REQUEST'
export const SAVE_LEVEL_SUCCESS = 'SAVE_LEVEL_SUCCESS'
export const SAVE_LEVEL_FAILURE = 'SAVE_LEVEL_FAILURE'

export const saveLevel = (data, userId) => ({
  [CALL_API]: {
    api: 'main',
    data: data,
    endpoint: `auth/user/${userId}/completedLevel`,
    method: 'PATCH',
    schema: Schemas.USER,
    types: [ SAVE_LEVEL_REQUEST, SAVE_LEVEL_SUCCESS, SAVE_LEVEL_FAILURE ]
  }
})

export const LOGOUT_USER = 'LOGOUT_USER'

export const logoutUserAction = () => ({
  type: LOGOUT_USER,
  response: { remove: ['session', 'user', 'students', 'ranks'] }
})

export const ACTIVATE_SESSION = 'ACTIVATE_SESSION'

export const activateSessionAction = session => ({
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
export const removeEntityAction = entity => ({
  type: REMOVE_ENTITY,
  response: { remove: entity }
})
