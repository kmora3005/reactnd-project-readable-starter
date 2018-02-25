import React from 'react'
import { Link } from 'react-router-dom'

const CommentsPage =(props)=> {
  const {comments, idPostInPath, isPostCreation, onUpdateCommentChosen, onRemoveComment} = props
  return <div>
    {!isPostCreation ?<Link to={`/posts/${idPostInPath}/comment/create`}>Create comment</Link>:''}
    {comments !=null ? comments.map((comment) => (
    !comment.deleted ?
      <p key={comment.id} >
        <Link to={`/posts/${idPostInPath}/comments/${comment.id}`} onClick={()=> onUpdateCommentChosen(comment)}>{comment.body}</Link>
        <button onClick={()=>{onRemoveComment(comment)}}>Remove</button>
      </p>:''
    )):
    !isPostCreation ?<label>No comments yet</label>:''}
    </div>
}

export default CommentsPage