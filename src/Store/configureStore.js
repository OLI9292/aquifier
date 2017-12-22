import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from '../Middleware/api'
import rootReducer from '../Reducers'

const configureStore = preloadedState => createStore(
  rootReducer,
  /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, api)
)

export default configureStore
