import * as API from '../utils/api'
import * as types from './types'

export const receiveComments = comments => {
  return {
    type: types.RECEIVE_COMMENTS,
    comments
  }
}
export const fetchComments = (id) => dispatch => (
  API.getComments(id)
    .then(comments => dispatch(receiveComments(comments)))
)

export const addComment = comments => {
  return {
    type: types.ADD_COMMENT,
    comments
  }
}
export const dispatchAddComment = (data) => dispatch => (
  API.createComment(data)
    .then(json => dispatch(addComment(json)))
)

export const removeComment = comments => {
  return {
    type: types.REMOVE_COMMENT,
    comments
  }
}
export const dispatchRemoveComment = (data) => dispatch => (
  API.removeComment(data.id)
    .then(json => dispatch(removeComment(data)))
)

export const updateComment = comments => {
  return {
    type: types.UPDATE_COMMENT,
    comments
  }
}
export const dispatchUpdateComment = (data) => dispatch => (
  API.updateComment(data.id,data)
    .then(json => dispatch(updateComment(json)))
)

export const voteComment = (id,option) => {
  return {
    type: types.VOTE_COMMENT,
    vote:{id,option}
  }
}
export const dispatchVoteComment = (id,option) => dispatch => (
  API.voteComment(id,option)
    .then(json => {
      dispatch(voteComment(id,option))
    })
)