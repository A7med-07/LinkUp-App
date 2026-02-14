import React, { useEffect, useState } from 'react'
import getAllPosts from './postApi'
import PostCard from '../Pages/PostCard'
import LoadingPage from '../Components/LoadingPage/LoadingPage'
import CreatPost from '../Components/CreatePost/CreatPost'


export default function Home() {

  const [allPosts , setallPosts] = useState([])
async function getPosts() {
  const response = await getAllPosts()


  if(response.message=='success'){
    console.log(response.posts);
    setallPosts(response.posts)
    
  }
}

  useEffect(() => {
    getPosts();
  }, []);
  return <>
<div className='bg-[#0f1419] min-h-screen'>
  <CreatPost callback={getPosts}/>

{allPosts.length > 0 ? allPosts.map((post)=>{return <PostCard callback={getPosts} allComment={false} post={post} key={post.id}/>}) : <LoadingPage/>}


</div>




  </>
}