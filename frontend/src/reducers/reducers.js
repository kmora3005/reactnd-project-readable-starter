import { combineReducers } from 'redux'

import {
    RECEIVE_POSTS,
    ADD_POST,
    REMOVE_POST,
    UPDATE_POST,
    VOTE_POST
} from '../actions/post_actions'

import {
    RECEIVE_COMMENTS,
    ADD_COMMENT,
    REMOVE_COMMENT,
    UPDATE_COMMENT,
    VOTE_COMMENT
} from '../actions/comment_actions'

const posts = (state = [], action) =>{
  const { posts, vote } = action

  switch (action.type) {
    case RECEIVE_POSTS :
      return [...state,
        ...posts]
    case ADD_POST :
      return [...state,
        posts]
    case REMOVE_POST :
      return state.filter(post => post.id !== posts.id)
    case UPDATE_POST :
      return [...state.filter(post => post.id !== posts.id),
        posts]
    case VOTE_POST:
      const postChanged=state.find(post => post.id === vote.id)
      if (vote.option.option==='upVote'){
        postChanged.voteScore++
      }
      else {
        postChanged.voteScore--
      }
      return [...state.filter(post => post.id !== vote.id),
        postChanged]
    default :
      return state
  }
}

const comments = (state = [], action) => {
  const { comments, vote } = action

  switch (action.type) {
    case RECEIVE_COMMENTS :
      let newComments=[]
      for (let comment of comments){
        let index= state.findIndex(commentSearched=>commentSearched.id===comment.id)
        if (index===-1){
          newComments.push(comment)
        }
      }
      return [...state,
        ...newComments]
    case ADD_COMMENT :
      return [...state,
        comments]
    case REMOVE_COMMENT :
      return state.filter(comment => comment.id !== comments.id)
    case UPDATE_COMMENT :
      return [...state.filter(comment => comment.id !== comments.id),
        comments]
    case VOTE_COMMENT:
      const commentChanged=state.find(comment => comment.id === vote.id)
      if (vote.option.option==='upVote'){
        commentChanged.voteScore++
      }
      else {
        commentChanged.voteScore--
      }
      return [...state.filter(comment => comment.id !== vote.id),
        commentChanged]
    default :
      return state
  }
}

export default combineReducers({
    posts,
    comments
  })