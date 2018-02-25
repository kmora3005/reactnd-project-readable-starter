import * as API from '../utils/api'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const ADD_POST = 'ADD_POST'
export const REMOVE_POST = 'REMOVE_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const VOTE_POST = 'VOTE_POST'

export const receivePosts = posts => {
  return {
    type: RECEIVE_POSTS,
    posts
  }
}
export const fetchPosts = () => dispatch => (
  API.getPosts()
    .then(posts => dispatch(receivePosts(posts)))
)

export const addPost = posts => {
  return {
    type: ADD_POST,
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
    type: REMOVE_POST,
    posts
  }
}
export const dispatchRemovePost = (data) => dispatch => (
  API.removePost(data.id)
    .then(json => dispatch(removePost(data)))
)

export const updatePost = posts => {
  return {
    type: UPDATE_POST,
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
    type: VOTE_POST,
    vote:{id,option}
  }
}
export const dispatchVotePost = (id,option) => dispatch => (
  API.votePost(id,option)
    .then(json => dispatch(votePost(id,option)))
)