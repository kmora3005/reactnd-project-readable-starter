import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as postActions from '../actions/postActions'
import * as commentActions from '../actions/commentActions'
import { Link,withRouter } from 'react-router-dom'
import sortBy from 'sort-by'
import RaisedButton from 'material-ui/RaisedButton'

class PostsPage extends Component {
  onVoteUp = (post)=>{
    this.props.votePost(post.id,{option:'upVote'})
  }

  onVoteDown = (post)=>{
    this.props.votePost(post.id,{option:'downVote'})
  }

  componentDidMount() {
    for(let post of this.props.posts){
      this.props.getComments(post.id)
    }
  }

render () {
  const { categories, posts, orderByValue, categoryChosen, onUpdateCategoryChosen, onUpdateOrderBy, 
    onUpdatePostChosen, onUpdateBeginAsEdition, removePost, comments, history } = this.props

  posts.sort(sortBy(orderByValue))

  return <div className="App-intro">
  <ul>
    <li key='home' >
      <Link to='/' onClick={()=> onUpdateCategoryChosen('')}>Home</Link>
    </li>
    {categories.map((category) => (
      <li key={category.name} >
        <Link to={`/${category.path}`} onClick={()=> onUpdateCategoryChosen(category.name)}>{category.name}</Link>
      </li>
    ))}
  </ul>
  <label>Order By:<select value={orderByValue} onChange={(event) => onUpdateOrderBy(event.target.value)}>
    <option value="voteScore">Score</option>
    <option value="timestamp">Date</option>
  </select>
  </label>
  <Link to='/post/create'>New post</Link>
  {posts !=null ? posts.map((post) => (
    !post.deleted && (post.category===categoryChosen || categoryChosen==='') ?
      <span key={post.id} >
        <Link to={`/${post.category}/${post.id}`} onClick={()=> onUpdatePostChosen(post)}>{post.title}</Link>
        <label>Author: {post.author} </label>
        <label>Comments: {comments.filter(comment=>comment.parentId===post.id).length} </label>
        <label>Score: {post.voteScore} </label>
        <RaisedButton onClick={()=>{removePost(post)}}>Remove</RaisedButton>
        <RaisedButton onClick={()=>{
          onUpdateBeginAsEdition(true) 
          history.push(`/${post.category}/${post.id}`)}}>Edit</RaisedButton>
        <label> Vote:</label>
        <RaisedButton onClick={()=>{this.onVoteUp(post)}} >Up</RaisedButton>
        <RaisedButton onClick={()=>{this.onVoteDown(post)}} >Down</RaisedButton>
      </span>:''
    )):<label>No posts yet</label>}
  </div> 
  }
}

const mapStateToProps =({ posts, comments }) =>{
  return {
    posts,
    comments
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    removePost: (data) => dispatch(postActions.dispatchRemovePost(data)),
    votePost: (id,data) => dispatch(postActions.dispatchVotePost(id,data)),
    getComments: (id) => dispatch(commentActions.fetchComments(id))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(PostsPage))