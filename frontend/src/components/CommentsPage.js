import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as commentActions from '../actions/commentActions'
import { Link,withRouter } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

class CommentsPage extends Component {
  onVoteUp = (comment)=>{
    this.props.voteComment(comment.id,{option:'upVote'})
  }

  onVoteDown = (comment)=>{
    this.props.voteComment(comment.id,{option:'downVote'})
  }

  render(){
    const {comments, categoryInPath, idPostInPath, isPostCreation, onUpdateCommentChosen, onUpdateBeginCommentAsEdition, removeComment, history} = this.props
    const commentsForPost=comments.filter(comment=>comment.parentId===idPostInPath)

    return <span>
      {!isPostCreation ?<label>Number of comments: {commentsForPost.length}</label>:''}
      {!isPostCreation ?<Link to={`/${categoryInPath}/${idPostInPath}/comment/create`}>New comment</Link>:''}
      {commentsForPost !=null ? commentsForPost.map((comment) => (
      !comment.deleted ?
        <span key={comment.id} >
          <Link to={`/${categoryInPath}/${idPostInPath}/${comment.id}`} onClick={()=> onUpdateCommentChosen(comment)}>{comment.body}</Link>
          <label>Author: {comment.author} </label>
          <label>Score: {comment.voteScore} </label>
          <RaisedButton onClick={()=>{removeComment(comment)}}>Remove</RaisedButton>
          <RaisedButton onClick={()=>{
            onUpdateBeginCommentAsEdition(true) 
            history.push(`/${categoryInPath}/${idPostInPath}/${comment.id}`)}}>Edit</RaisedButton>
          <label> Vote:</label>
          <RaisedButton onClick={()=>{this.onVoteUp(comment)}} >Up</RaisedButton>
          <RaisedButton onClick={()=>{this.onVoteDown(comment)}} >Down</RaisedButton>
        </span>:''
      )):
      !isPostCreation ?<label>No comments yet</label>:''}
      </span>
  }
}

const mapStateToProps =({ comments }) =>{
  return {
    comments
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    removeComment: (data) => dispatch(commentActions.dispatchRemoveComment(data)),
    voteComment: (id,data) => dispatch(commentActions.dispatchVoteComment(id,data))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsPage))