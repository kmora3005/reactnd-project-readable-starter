import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as postActions from './actions/postActions'
import * as commentActions from './actions/commentActions'
import { Route, withRouter  } from 'react-router-dom'
import PostPage from './components/PostPage'
import PostsPage from './components/PostsPage'
import CommentPage from './components/CommentPage'
import './App.css';
import * as API from './utils/api'
import {getCategoryFromLocation, getIdPostFromLocation, getIdCommentFromLocation} from './utils/helpers'

class App extends Component {
  state = {
    categories:[],
    categoryChosen:'',
    postChosen:null,
    commentChosen:null,
    beginAsEdition:false,
    beginCommentAsEdition:false,
    orderByValue:'timestamp'
  }

  onUpdateOrderBy=(newValue)=>{
    this.setState({orderByValue:newValue})
  }

  onUpdateCategoryChosen=(newValue)=>{
    this.setState({categoryChosen:newValue})
  }

  onUpdatePostChosen=(post)=>{
    this.setState({postChosen:post})
  }

  onUpdateCommentChosen=(comment)=>{
    this.setState({commentChosen:comment})
  }

  onUpdateBeginAsEdition=(isForEdition)=>{
    this.setState({beginAsEdition:isForEdition})
  }

  onUpdateBeginCommentAsEdition=(isForEdition)=>{
    this.setState({beginCommentAsEdition:isForEdition})
  }

  resetPostChosen=()=>{
    this.setState({postChosen:null})
  }

  getPostChosen=(id)=>{
    return this.props.posts.find(post=>post.id===id)
  }

  getCommentChosen=(id)=>{
    return this.props.comments.find(comment=>comment.id===id)
  }

  componentDidMount() {
    const {comments, getComments,getPosts, location}=this.props
    API.getCategories().then((categories) => {
      this.setState({ categories:categories.categories })
    })
    getPosts()

    const idPostInPath=this.state.postChosen!=null ? this.state.postChosen.id : getIdPostFromLocation(location)
    const commentsForPost = comments.filter(comment=>comment.parentId===idPostInPath)
    if ((commentsForPost.length===0)&&(idPostInPath!=='')){
      getComments(idPostInPath)
    }
  }

  buildPages=()=>{
    const { categories, postChosen, commentChosen, orderByValue, beginAsEdition, beginCommentAsEdition } = this.state
    const { location } = this.props
    const categoryInPath=postChosen!=null ? postChosen.category : getCategoryFromLocation(location)
    const idPostInPath=postChosen!=null ? postChosen.id : getIdPostFromLocation(location)
    const idCommentInPath=commentChosen!=null ? commentChosen.id : getIdCommentFromLocation(location)
    
  return <div className="App">
  <Route exact path={`/${categoryInPath}`} render={() => (
    <PostsPage 
      categories={categories} 
      orderByValue={orderByValue} 
      categoryChosen={categoryInPath} 
      onUpdateCategoryChosen={this.onUpdateCategoryChosen} 
      onUpdateOrderBy={this.onUpdateOrderBy} 
      onUpdatePostChosen={this.onUpdatePostChosen} 
      onUpdateBeginAsEdition={this.onUpdateBeginAsEdition}
      />
  )}/>
  <Route exact path={`/post/create`} render={() => (
    <PostPage 
      categories={categories} 
      isCreation={true}
      resetPostChosen={this.resetPostChosen} 
    />
  )}/>
  {(categoryInPath && idPostInPath) ?<Route exact path={`/${categoryInPath}/${idPostInPath}`} render={() => (
    <PostPage 
      categories={categories} 
      isCreation={false} 
      beginAsEdition={beginAsEdition}
      postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
      onUpdateBeginAsEdition={this.onUpdateBeginAsEdition} 
      onUpdateBeginCommentAsEdition={this.onUpdateBeginCommentAsEdition} 
      onUpdateCommentChosen={this.onUpdateCommentChosen} 
      resetPostChosen={this.resetPostChosen}
    />
    )}/>:''}
  <Route exact path={`/${categoryInPath}/${idPostInPath}/comment/create`} render={() => (
    <CommentPage 
      isCreation={true} 
      postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
      resetPostChosen={this.resetPostChosen}
    />
  )}/>
  <Route exact path={`/${categoryInPath}/${idPostInPath}/${idCommentInPath}`} render={() => (
    <CommentPage 
      isCreation={false} 
      beginCommentAsEdition={beginCommentAsEdition}
      postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
      commentChosen={commentChosen!=null ? commentChosen: this.getCommentChosen(idCommentInPath)}
      onUpdateBeginCommentAsEdition={this.onUpdateBeginCommentAsEdition} 
      resetPostChosen={this.resetPostChosen}
    />
  )}/>
</div>
  }
  
  render() {
    const categoryInPath=this.state.postChosen!=null ? this.state.postChosen.category : getCategoryFromLocation(this.props.location)
    const existCategoryOrIsRoot=categoryInPath===''?true:this.state.categories.findIndex(category=>category.path===categoryInPath)!==-1
    
    return (
      <div>
      {existCategoryOrIsRoot ? this.buildPages() :'This category does not exist'}
      </div>
    )
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
    getPosts: () => dispatch(postActions.fetchPosts()),
    addPost: (data) => dispatch(postActions.dispatchAddPost(data)),
    removePost: (data) => dispatch(postActions.dispatchRemovePost(data)),
    updatePost: (data) => dispatch(postActions.dispatchUpdatePost(data)),
    getComments: (id) => dispatch(commentActions.fetchComments(id)),
    addComment: (data) => dispatch(commentActions.dispatchAddComment(data)),
    removeComment: (data) => dispatch(commentActions.dispatchRemoveComment(data)),
    updateComment: (data) => dispatch(commentActions.dispatchUpdateComment(data))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
