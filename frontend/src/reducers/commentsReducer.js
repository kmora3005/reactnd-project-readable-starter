import * as types from '../actions/types'

export const comments = (state = [], action) => {
    const { comments, vote } = action
  
    switch (action.type) {
      case types.RECEIVE_COMMENTS :
        let newComments=[]
        for (let comment of comments){
          let index= state.findIndex(commentSearched=>commentSearched.id===comment.id)
          if (index===-1){
            newComments.push(comment)
          }
        }
        return [...state,
          ...newComments]
      case types.ADD_COMMENT :
        return [...state,
          comments]
      case types.REMOVE_COMMENT :
        return state.filter(comment => comment.id !== comments.id)
      case types.UPDATE_COMMENT :
        return [...state.filter(comment => comment.id !== comments.id),
          comments]
      case types.VOTE_COMMENT:
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