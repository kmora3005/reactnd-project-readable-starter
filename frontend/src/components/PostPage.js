import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import {guid, formattedDate} from '../utils/helpers'
import CommentsPage from '../components/CommentsPage'
import * as postActions from '../actions/postActions'
import * as commentActions from '../actions/commentActions'
import { getCategoryFromLocation, getIdPostFromLocation } from '../utils/helpers'
import RaisedButton from 'material-ui/RaisedButton'

class PostPage extends Component {
  state = {
    categoryChosen:'react',
    isEdition:false,
    isCreation:false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const values = serializeForm(e.target, { hash: true })
    const { postChosen, addPost, updatePost, onUpdateBeginAsEdition, history } = this.props
    const {isCreation, isEdition, categoryChosen} = this.state
    if (isCreation){
      values.id = guid()
      values.timestamp=Date.now()
      values.category=categoryChosen
      addPost(values)
      history.push('/')
    }
    else if (isEdition){
      postChosen.title=values.title
      postChosen.body=values.body
      updatePost(postChosen)
      this.setState({isEdition:false})
      onUpdateBeginAsEdition(false)
      history.push(`/${postChosen.category}/${postChosen.id}`)
    }
  }

  onUpdateCategory = (newValue)=>{
    this.setState({categoryChosen:newValue})
  }

  onUpdateIsEdition = ()=>{
    this.setState({isEdition:true})
  }

  onVoteUp = ()=>{
    const {postChosen, votePost, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : getIdPostFromLocation(location)
    votePost(idPostInPath,{option:'upVote'})
  }

  onVoteDown = ()=>{
    const {postChosen, votePost, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : getIdPostFromLocation(location)
    votePost(idPostInPath,{option:'downVote'})
  }
  
  componentDidMount() {
    const {categories, comments, postChosen, isCreation, beginAsEdition, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : getIdPostFromLocation(location)
    
    if (!postChosen){
      if (categories.length >0){
        this.setState({isCreation:isCreation, categoryChosen:categories[0].name, isEdition:false})
      }
      else {
        this.setState({isCreation:isCreation, isEdition:false})
      }
    }
    else {
      this.setState({isCreation:isCreation, categoryChosen:postChosen.category, isEdition:beginAsEdition})
    }

    const commentsForPost = comments.filter(comment=>comment.parentId===idPostInPath)
    if ((commentsForPost.length===0)&&(idPostInPath!=='')){
      this.props.getComments(idPostInPath)
    }
  }

  addNewButton = ()=>{
    return this.props.postChosen ? <RaisedButton onClick={() => {this.props.history.push('/post/create')}} >New</RaisedButton>:''
  }

  addEditButton = ()=>{
    return this.props.postChosen ?<RaisedButton onClick={this.onUpdateIsEdition} >Edit</RaisedButton>:''
  }

  addRemoveButton = ()=>{
    return this.props.postChosen ?
    <RaisedButton onClick={() => {
      this.props.removePost(this.props.postChosen)
      this.props.history.push('/')
    }} >Remove</RaisedButton>:''
  }

  addVoteButton = ()=>{
    return this.props.postChosen ?
    <span>
      <label>Vote:</label>
      <RaisedButton onClick={this.onVoteUp} >Up</RaisedButton>
      <RaisedButton onClick={this.onVoteDown} >Down</RaisedButton>
    </span>:''
  }

  addButtonsPanel = ()=>{
    return <span>
    {
      this.addNewButton()
    }
    {
      this.addEditButton()
    }
    {
      this.addRemoveButton()
    }
    {
      this.addVoteButton()
    }</span>
  }

  addTitle = ()=>{
    return this.state.isEdition || this.state.isCreation ?
      <input type='text' name='title' placeholder='Title' defaultValue={this.props.postChosen ? this.props.postChosen.title:''} />:
      <label>{this.props.postChosen ? this.props.postChosen.title:''}</label>
  }

  addBody = ()=>{
    return this.state.isEdition || this.state.isCreation ?
      <input type='text' name='body' placeholder='Body' defaultValue={this.props.postChosen ? this.props.postChosen.body:''} />:
      <label>{this.props.postChosen ? this.props.postChosen.body:''}</label>
  }

  addAuthor = ()=>{
    return this.state.isCreation ?
      <input type='text' name='author' placeholder='Author' defaultValue={this.props.postChosen ? this.props.postChosen.author:''} />:
      <label>{this.props.postChosen ? this.props.postChosen.author:''}</label>
  }

  addCategory = ()=>{
    return this.state.isCreation ?
    <select value={this.state.categoryChosen} onChange={(event) => this.onUpdateCategory(event.target.value)}>
      {this.props.categories.map((category)=>(<option key={category.name} value={category.name}>{category.name}</option>) )}
    </select>:
    <label>{this.props.postChosen ? this.props.postChosen.category:''}</label>
  }

  addDate = ()=>{
    return !this.state.isCreation ?<span><strong>Date:</strong><label>{this.props.postChosen ? formattedDate(this.props.postChosen.timestamp):''}</label></span>:''
  }

  addVoteScore = ()=>{
    return !this.state.isCreation ?<span><strong>Vote score:</strong><label>{this.props.postChosen ? this.props.postChosen.voteScore ? this.props.postChosen.voteScore:'1':'1'}</label></span>:''
  }

  addAddPostButton = ()=>{
    return this.state.isCreation ?<RaisedButton>Add Post</RaisedButton>:''
  }

  addUpdatePostButton = ()=>{
    return this.state.isEdition ?<RaisedButton>Update Post</RaisedButton>:''
  }

  addComments = ()=>{
    const {categories, postChosen, comments, onUpdateCommentChosen,onUpdateBeginCommentAsEdition, removePost,updatePost,location,history} = this.props
    const {isEdition, isCreation, categoryChosen} = this.state
    const categoryInPath=postChosen!=null ? postChosen.category : getCategoryFromLocation(location)
    const idPostInPath=postChosen!=null ? postChosen.id : getIdPostFromLocation(location)
    const commentsForPost = comments.filter(comment=>comment.parentId===idPostInPath)

    return !isEdition ? <CommentsPage categoryInPath={categoryInPath} 
      comments={commentsForPost} 
      idPostInPath={idPostInPath} 
      isPostCreation={isCreation} 
      onUpdateCommentChosen={onUpdateCommentChosen}
      onUpdateBeginCommentAsEdition={onUpdateBeginCommentAsEdition}
      />:''
  }

  addForm = ()=>{
    return <form onSubmit={this.handleSubmit} >
    <span>
      <strong>Title:</strong>
      {
        this.addTitle()
      }
    </span>
    <span>
      <strong>Body:</strong>
      { 
        this.addBody()
      }
    </span>
    <span>
      <strong>Author:</strong>
      {
        this.addAuthor()
      }
    </span>
    <span>
      <strong>Category:</strong>
      { 
        this.addCategory()
      }
    </span>
    { 
      this.addDate()
    }
    { 
      this.addVoteScore()
    }
    { 
      this.addAddPostButton()
    }
    { 
      this.addUpdatePostButton()
    }
  </form>
  }

  buildPageInfoPost = ()=>{
    return <span>
    {
      this.addButtonsPanel()
    }
    {
      this.addForm()
    }
    {
      this.addComments()
    }</span>
  }

  render() {
    return (
      <div>
        <Link to='/'>Home</Link>
        {
          this.state.isCreation || this.props.postChosen!=null ? this.buildPageInfoPost():'This post does not exist'
        }
      </div>)
  }
}

const mapStateToProps =({ posts,comments }) =>{
  return {
    posts,
    comments
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    getComments: (id) => dispatch(commentActions.fetchComments(id)),
    addComment: (data) => dispatch(commentActions.dispatchAddComment(data)),
    removeComment: (data) => dispatch(commentActions.dispatchRemoveComment(data)),
    updateComment: (data) => dispatch(commentActions.dispatchUpdateComment(data)),
    votePost: (id,data) => dispatch(postActions.dispatchVotePost(id,data)),
    addPost: (data) => dispatch(postActions.dispatchAddPost(data)),
    removePost: (data) => dispatch(postActions.dispatchRemovePost(data)),
    updatePost: (data) => dispatch(postActions.dispatchUpdatePost(data)),
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PostPage))