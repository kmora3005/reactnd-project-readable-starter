import * as API from '../utils/api'
import * as types from './types'

export const receivePosts = posts => {
  return {
    type: types.RECEIVE_POSTS,
    posts
  }
}
export const fetchPosts = () => dispatch => (
  API.getPosts()
    .then(posts => dispatch(receivePosts(posts)))
)

export const addPost = posts => {
  return {
    type: types.ADD_POST,
    posts
  }
}
export const dispatchAddPost = (data) => dispatch => (
  API.createPost(data)
    .then(json => {
      dispatch(addPost(json))
    })
)

export const removePost = posts => {
  return {
    type: types.REMOVE_POST,
    posts
  }
}
export const dispatchRemovePost = (data) => dispatch => (
  API.removePost(data.id)
    .then(json => dispatch(removePost(data)))
)

export const updatePost = posts => {
  return {
    type: types.UPDATE_POST,
    posts
  }
}
export const dispatchUpdatePost = (data) => dispatch => (
  API.updatePost(data.id,data)
    .then(json => {
      dispatch(updatePost(json))})
)

export const votePost = (id,option) => {
  return {
    type: types.VOTE_POST,
    vote:{id,option}
  }
}
export const dispatchVotePost = (id,option) => dispatch => (
  API.votePost(id,option)
    .then(json => dispatch(votePost(id,option)))
)