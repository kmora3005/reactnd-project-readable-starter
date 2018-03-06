import { combineReducers } from 'redux'
import {posts} from './postsReducers'
import {comments} from './commentsReducer'

export default combineReducers({
    posts,
    comments
  })