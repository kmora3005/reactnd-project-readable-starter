import * as types from '../actions/types'

export const posts =(state = [], action) =>{
    const { posts, vote } = action
  
    switch (action.type) {
      case types.RECEIVE_POSTS :
        return [...state,
          ...posts]
      case types.ADD_POST :
        return [...state,
          posts]
      case types.REMOVE_POST :
        return state.filter(post => post.id !== posts.id)
      case types.UPDATE_POST :
        return [...state.filter(post => post.id !== posts.id),
          posts]
      case types.VOTE_POST:
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