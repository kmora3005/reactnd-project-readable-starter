import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import * as utils from '../utils/helpers'
import * as commentActions from '../actions/commentActions'
import RaisedButton from 'material-ui/RaisedButton'

class CommentPage extends Component {
  state = {
    isEdition:false,
    isCreation:false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const values = serializeForm(e.target, { hash: true })
    const {postChosen, commentChosen, addComment, updateComment, onUpdateBeginCommentAsEdition, history } = this.props
    const {isCreation, isEdition} = this.state
    if (isCreation){
      values.id = utils.guid()
      values.timestamp=Date.now()
      values.parentId=postChosen.id
      addComment(values)
      history.push(`/${postChosen.category}/${postChosen.id}`)
    }
    else if (isEdition){
      commentChosen.body=values.body
      updateComment(commentChosen)
      onUpdateBeginCommentAsEdition(false) 
      history.push(`/${postChosen.category}/${postChosen.id}`)
    }
  }

  onUpdateIsEdition = ()=>{
    this.setState({isEdition:true})
  }

  onVoteUp = ()=>{
    const {categoryChosen, postChosen, commentChosen, voteComment, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : utils.getIdPostFromLocation(location)
    const idCommentInPath=commentChosen!=null ? commentChosen.id : utils.getIdCommentFromLocation(location)
    voteComment(idCommentInPath,{option:'upVote'})
  }

  onVoteDown = ()=>{
    const {categoryChosen, postChosen, commentChosen, voteComment, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : utils.getIdPostFromLocation(location)
    const idCommentInPath=commentChosen!=null ? commentChosen.id : utils.getIdCommentFromLocation(location)
    voteComment(idCommentInPath,{option:'downVote'})
  }

  buildPageInfoComment = ()=>{
    const {categoryChosen, postChosen, commentChosen, removeComment, location, history} = this.props
    const {isEdition, isCreation} = this.state
    const categoryInPath=postChosen!=null ? postChosen.category : utils.getCategoryFromLocation(location)
    const idPostInPath=postChosen!=null ? postChosen.id : utils.getIdPostFromLocation(location)
    const idCommentInPath=commentChosen!=null ? commentChosen.id : utils.getIdCommentFromLocation(location)
    return <span>
    {
      commentChosen ?
      <RaisedButton onClick={()=>{history.push(`/${categoryInPath}/${idPostInPath}/comment/create`)}}>New</RaisedButton>:''
    }
    {
      commentChosen ? 
      <RaisedButton onClick={this.onUpdateIsEdition} >Edit</RaisedButton>:''
    }
    {
      commentChosen ?
      <RaisedButton onClick={()=>{
        removeComment(this.props.commentChosen)
        history.push(`/${categoryInPath}/${idPostInPath}/`)
      }} >Remove</RaisedButton>:''
    }
    {commentChosen ?
      <span>
      <label>Vote:</label>
      <RaisedButton onClick={this.onVoteUp} >Up</RaisedButton>
      <RaisedButton onClick={this.onVoteDown} >Down</RaisedButton>
      </span>:''
    }
    <form onSubmit={this.handleSubmit} >
      <span>
        <strong>Body:</strong>
        { 
          isEdition || isCreation ?
          <input type='text' name='body' placeholder='Body' defaultValue={commentChosen ? commentChosen.body:''} />:
          <label>{commentChosen ? commentChosen.body:''}</label>
        }
      </span>
      <span>
        <strong>Author:</strong>
        {
          isCreation ?
          <input type='text' name='author' placeholder='Author' defaultValue={commentChosen ? commentChosen.author:''} />:
          <label>{commentChosen ? commentChosen.author:''}</label>
        }
      </span>
      { 
        !isCreation ?<span><strong>Date:</strong><label>{commentChosen ? utils.formattedDate(commentChosen.timestamp):''}</label></span>:''
      }
      { 
        !isCreation ?<span><strong>Vote score:</strong><label>{commentChosen ? commentChosen.voteScore:''}</label></span>:''
      }
      { 
        isCreation ?<RaisedButton>Add Comment</RaisedButton>:''
      }
      { 
        isEdition ?<RaisedButton>Update Comment</RaisedButton>:''
      }
    </form>
    </span>
  }

  componentDidMount() {
    const {isCreation, beginCommentAsEdition} = this.props
    this.setState({isCreation:isCreation, isEdition: beginCommentAsEdition})
  }

  render() {
    const {categoryChosen, postChosen, commentChosen, removeComment, location, history} = this.props
    const {isEdition, isCreation} = this.state
    const categoryInPath=postChosen!=null ? postChosen.category : utils.getCategoryFromLocation(location)
    const idPostInPath=postChosen!=null ? postChosen.id : utils.getIdPostFromLocation(location)
    const idCommentInPath=commentChosen!=null ? commentChosen.id : utils.getIdCommentFromLocation(location)
    
    return (
      <div>
        <Link to='/'>Home</Link>
        <Link to={`/${categoryInPath}/${idPostInPath}`}>Back</Link>
        {
          this.state.isCreation || this.props.commentChosen!=null ? this.buildPageInfoComment():'This comment does not exist'
        }
      </div>
    )
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    addComment: (data) => dispatch(commentActions.dispatchAddComment(data)),
    updateComment: (data) => dispatch(commentActions.dispatchUpdateComment(data)),
    removeComment: (data) => dispatch(commentActions.dispatchRemoveComment(data)),
    voteComment: (id,data) => dispatch(commentActions.dispatchVoteComment(id,data))
  }
}

export default withRouter(connect(
  null,
  mapDispatchToProps
)(CommentPage))