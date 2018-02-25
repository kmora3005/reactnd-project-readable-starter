import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPosts, dispatchAddPost, dispatchRemovePost, dispatchUpdatePost} from './actions/post_actions'
import { fetchComments, dispatchAddComment, dispatchRemoveComment, dispatchUpdateComment} from './actions/comment_actions'
import { Route, withRouter  } from 'react-router-dom'
import PostPage from './components/PostPage'
import PostsPage from './components/PostsPage'
import CommentPage from './components/CommentPage'
import './App.css';
import * as API from './utils/api'

class App extends Component {
  state = {
    categories:[],
    categoryChosen:'',
    postChosen:null,
    commentChosen:null,
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

  getPostChosen=(id)=>{
    return this.props.posts.find(post=>post.id===id)
  }

  getCommentChosen=(id)=>{
    return this.props.comments.find(comment=>comment.id===id)
  }

  componentDidMount() {
    API.getCategories().then((categories) => {
      this.setState({ categories:categories.categories })
    })
    
    this.props.getPosts()

    const idPostInPath=this.state.postChosen!=null ? this.state.postChosen.id : this.props.location.pathname.replace('/posts/','').replace('/comment/create','')
    const comments = this.props.comments.filter(comment=>comment.parentId===idPostInPath)
    if ((comments.length===0)&&((idPostInPath!=='/')&&(idPostInPath!=='/post/create'))){
      console.log(idPostInPath)
      this.props.getComments(idPostInPath)
    }
  }
  
  render() {
    const { categories, categoryChosen, postChosen, commentChosen, orderByValue } = this.state
    const { posts, addPost, removePost, updatePost, addComment, removeComment, updateComment, location } = this.props
    const idPostInPath=postChosen!=null ? postChosen.id : location.pathname.replace('/posts/','').replace('/comment/create','')
    const idCommentInPath=commentChosen!=null ? commentChosen.id : location.pathname.replace('/posts/'+idPostInPath+'/comments/','')

    return (
      <div className="App">
        <Route exact path={`/${categoryChosen}`} render={() => (
          <PostsPage 
            categories={categories} 
            posts={posts} 
            orderByValue={orderByValue} 
            categoryChosen={categoryChosen} 
            onUpdateCategoryChosen={this.onUpdateCategoryChosen} 
            onUpdateOrderBy={this.onUpdateOrderBy} 
            onUpdatePostChosen={this.onUpdatePostChosen} 
            onRemovePost={removePost} 
            />
        )}/>
        <Route exact path='/post/create' render={({ history }) => (
          <PostPage 
            categories={categories} 
            isCreation={true} 
            onCreatePost={(post) => {
              addPost(post)
              history.push('/')
            }}
          />
        )}/>
        <Route exact path={`/posts/${idPostInPath}`} render={({ history }) => (
          <PostPage 
            categories={categories} 
            isCreation={false} 
            postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
            onRemoveComment={removeComment} 
            onUpdateCommentChosen={this.onUpdateCommentChosen} 
            onUpdatePost={(post) => {
              updatePost(post)
              history.push(`/posts/${idPostInPath}`)
            }}
          />
          )}/>
        <Route exact path={`/posts/${idPostInPath}/comment/create`} render={({ history }) => (
          <CommentPage 
            isCreation={true} 
            postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
            onCreateComment={(comment) => {
              addComment(comment)
              history.push(`/posts/${idPostInPath}`)
            }}
          />
        )}/>
        <Route exact path={`/posts/${idPostInPath}/comments/${idCommentInPath}`} render={({ history }) => (
          <CommentPage 
            isCreation={false} 
            postChosen={postChosen!=null ? postChosen: this.getPostChosen(idPostInPath)} 
            commentChosen={commentChosen!=null ? commentChosen: this.getCommentChosen(idCommentInPath)}
            onUpdateCommentChosen={(comment) => {
              updateComment(comment)
              history.push(`/posts/${idPostInPath}`)
            }}
          />
        )}/>
        
      </div>
    )
  }
}

const mapStateToProps =({ posts, comments }) =>{
  return {
    posts: posts,
    comments: comments
  }
}

const mapDispatchToProps =(dispatch)=> {
  return {
    getPosts: () => dispatch(fetchPosts()),
    addPost: (data) => dispatch(dispatchAddPost(data)),
    removePost: (data) => dispatch(dispatchRemovePost(data)),
    updatePost: (data) => dispatch(dispatchUpdatePost(data)),
    getComments: (id) => dispatch(fetchComments(id)),
    addComment: (data) => dispatch(dispatchAddComment(data)),
    removeComment: (data) => dispatch(dispatchRemoveComment(data)),
    updateComment: (data) => dispatch(dispatchUpdateComment(data))
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
