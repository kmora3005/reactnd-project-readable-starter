import React from 'react'
import { Link } from 'react-router-dom'
import sortBy from 'sort-by'

const PostsPage =(props)=> {
  const { categories, posts, orderByValue, categoryChosen, onUpdateCategoryChosen, onUpdateOrderBy, onUpdatePostChosen, onRemovePost } = props
  posts.sort(sortBy(orderByValue))

  return <div className="App-intro">
  <ul>
    <li key='home' >
      <Link to='/' onClick={()=> onUpdateCategoryChosen('')}>home</Link>
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
  <Link to='/post/create'>Create post</Link>
  {posts !=null ? posts.map((post) => (
    !post.deleted && (post.category===categoryChosen || categoryChosen==='') ?
      <p key={post.id} >
        <Link to={`/posts/${post.id}`} onClick={()=> onUpdatePostChosen(post)}>{post.title}</Link>
        <button onClick={()=>{onRemovePost(post)}}>Remove</button>
      </p>:''
    )):<label>No posts yet</label>}
</div> 
}

export default PostsPage