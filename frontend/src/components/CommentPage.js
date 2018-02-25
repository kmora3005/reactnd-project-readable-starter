import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import {guid, formattedDate} from '../utils/helpers'
import { dispatchVoteComment} from '../actions/comment_actions'

class CommentPage extends Component {
  state = {
    isEdition:false,
    isCreation:false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const values = serializeForm(e.target, { hash: true })
    const {postChosen, commentChosen, onCreateComment, onUpdateCommentChosen } = this.props
    if (onCreateComment){
      values.id = guid()
      values.timestamp=Date.now()
      values.parentId=postChosen.id
      onCreateComment(values)
    }
    else if (onUpdateCommentChosen){
      commentChosen.body=values.body
      onUpdateCommentChosen(commentChosen)
    }
  }

  onUpdateIsEdition = ()=>{
    this.setState({isEdition:true})
  }

  onVoteUp = ()=>{
    const {postChosen, commentChosen, voteComment, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    const idCommentInPath=commentChosen!=null ? commentChosen.id : location.pathname.replace('/posts/'+idPostInPath+'/comments/','')
    voteComment(idCommentInPath,{option:'upVote'})
  }

  onVoteDown = ()=>{
    const {postChosen, commentChosen, voteComment, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    const idCommentInPath=commentChosen!=null ? commentChosen.id : location.pathname.replace('/posts/'+idPostInPath+'/comments/','')
    voteComment(idCommentInPath,{option:'downVote'})
  }

  componentDidMount() {
    const {isCreation} = this.props
    this.setState({isCreation:isCreation})
  }

  render() {
    const {postChosen, commentChosen, location} = this.props
    const {isEdition, isCreation} = this.state
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    
    return (
      <div>
        <Link to='/'>Back</Link>
        {
          commentChosen ?
          <Link to={`/posts/${idPostInPath}/comment/create`}>New</Link>:''
        }
        {
          commentChosen ? 
          <Link to={`/posts/${idPostInPath}/comments/${commentChosen.id}`} onClick={this.onUpdateIsEdition} >Edit</Link>:''
        }
        {commentChosen ?
          <p>
          <label>Vote:</label>
          <button onClick={this.onVoteUp} >Up</button>
          <button onClick={this.onVoteDown} >Down</button>
          </p>:''
        }
        <form onSubmit={this.handleSubmit} >
          <div>
          <p>
            <strong>Body:</strong>
            { 
              isEdition || isCreation ?
              <input type='text' name='body' placeholder='Body' defaultValue={commentChosen ? commentChosen.body:''} />:
              <label>{commentChosen ? commentChosen.body:''}</label>
            }
          </p>
          <p>
            <strong>Author:</strong>
            {
              isCreation ?
              <input type='text' name='author' placeholder='Author' defaultValue={commentChosen ? commentChosen.author:''} />:
              <label>{commentChosen ? commentChosen.author:''}</label>
            }
          </p>
          { 
            !isCreation ?<p><strong>Date:</strong><label>{commentChosen ? formattedDate(commentChosen.timestamp):''}</label></p>:''
          }
          { 
            !isCreation ?<p><strong>Vote score:</strong><label>{commentChosen ? commentChosen.voteScore:''}</label></p>:''
          }
          { 
            isCreation ?<button>Add Comment</button>:''
          }
          { 
            isEdition ?<button>Update Comment</button>:''
          }
          </div>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    voteComment: (id,data) => dispatch(dispatchVoteComment(id,data))
  }
}

export default withRouter(connect(
  null,
  mapDispatchToProps
)(CommentPage))