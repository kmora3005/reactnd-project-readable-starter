import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import {guid, formattedDate} from '../utils/helpers'
import CommentsPage from '../components/CommentsPage'
import { fetchComments, dispatchAddComment, dispatchRemoveComment, dispatchUpdateComment} from '../actions/comment_actions'
import { dispatchVotePost} from '../actions/post_actions'

class PostPage extends Component {
  state = {
    categoryChosen:'react',
    isEdition:false,
    isCreation:false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const values = serializeForm(e.target, { hash: true })
    const {postChosen, onCreatePost, onUpdatePost } = this.props
    if (onCreatePost){
      values.id = guid()
      values.timestamp=Date.now()
      values.category=this.state.categoryChosen
      onCreatePost(values)
    }
    else if (onUpdatePost){
      postChosen.title=values.title
      postChosen.body=values.body
      onUpdatePost(postChosen)
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
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    votePost(idPostInPath,{option:'upVote'})
  }

  onVoteDown = ()=>{
    const {postChosen, votePost, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    votePost(idPostInPath,{option:'downVote'})
  }
  
  componentDidMount() {
    const {categories, postChosen, isCreation, location} = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    
    if (!postChosen){
      if (categories.length >0){
        this.setState({isCreation:isCreation,categoryChosen:categories[0].name})
      }
      else {
        this.setState({isCreation:isCreation})
      }
    }
    else {
      this.setState({isCreation:isCreation,categoryChosen:postChosen.category})
    }

    const comments = this.props.comments.filter(comment=>comment.parentId===idPostInPath)
    if ((comments.length===0)&&(idPostInPath!=='/post/create')){
      
      this.props.getComments(idPostInPath)
    }
  }

  render() {
    const {categories, postChosen, comments, onUpdateCommentChosen, onRemoveComment,location} = this.props
    const {isEdition, isCreation, categoryChosen} = this.state
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    const commentsForPost = comments.filter(comment=>comment.parentId===idPostInPath)
    
    return (
      <div>
        <Link to='/'>Home</Link>
        {
          postChosen ?
          <Link to='/post/create'>New</Link>:''
        }
        {
          postChosen ?
          <Link to={`/posts/${idPostInPath}`} onClick={this.onUpdateIsEdition} >Edit</Link>:''
        }
        {
          postChosen ?
          <p>
            <label>Vote:</label>
            <button onClick={this.onVoteUp} >Up</button>
            <button onClick={this.onVoteDown} >Down</button>
          </p>:''
        }
        
        <form onSubmit={this.handleSubmit} >
          <div>
          <p>
          <strong>Title:</strong>
          {
            isEdition || isCreation ?
            <input type='text' name='title' placeholder='Title' defaultValue={postChosen ? postChosen.title:''} />:
            <label>{postChosen ? postChosen.title:''}</label>
          }
          </p>
          <p>
            <strong>Body:</strong>
          { 
            isEdition || isCreation ?
            <input type='text' name='body' placeholder='Body' defaultValue={postChosen ? postChosen.body:''} />:
            <label>{postChosen ? postChosen.body:''}</label>
          }
          </p>
          <p>
            <strong>Author:</strong>
            {
              isCreation ?
              <input type='text' name='author' placeholder='Author' defaultValue={postChosen ? postChosen.author:''} />:
              <label>{postChosen ? postChosen.author:''}</label>
            }
          </p>
          <p>
          <strong>Category:</strong>
          { 
            isCreation ?
            <select value={categoryChosen} onChange={(event) => this.onUpdateCategory(event.target.value)}>
              {categories.map((category)=>(<option key={category.name} value={category.name}>{category.name}</option>) )}
            </select>:
            <label>{postChosen ? postChosen.category:''}</label>
          }
          </p>
          { 
            !isCreation ?<p><strong>Date:</strong><label>{postChosen ? formattedDate(postChosen.timestamp):''}</label></p>:''
          }
          { 
            !isCreation ?<p><strong>Vote score:</strong><label>{postChosen ? postChosen.voteScore?postChosen.voteScore:'1':'1'}</label></p>:''
          }
          { 
            isCreation ?<button>Add Post</button>:''
          }
          { 
            isEdition ?<button>Update Post</button>:''
          }
          </div>
        </form>
        { 
          !isEdition ? <CommentsPage 
          comments={commentsForPost} 
          idPostInPath={idPostInPath} 
          isPostCreation={isCreation} 
          onUpdateCommentChosen={onUpdateCommentChosen}
          onRemoveComment={onRemoveComment}
          />:''
        }
      </div>
    )
  }
}

const mapStateToProps =({ posts, comments }) =>{
  return {
    comments: comments
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    getComments: (id) => dispatch(fetchComments(id)),
    addComment: (data) => dispatch(dispatchAddComment(data)),
    removeComment: (data) => dispatch(dispatchRemoveComment(data)),
    updateComment: (data) => dispatch(dispatchUpdateComment(data)),
    votePost: (id,data) => dispatch(dispatchVotePost(id,data))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PostPage))