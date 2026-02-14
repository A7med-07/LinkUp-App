import React, { useEffect } from 'react'
import { getSinglePost } from './postApi'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import PostCard from '../Pages/PostCard'
import LoadingPage from '../Components/LoadingPage/LoadingPage';

export default function SinglePost() {

  let { id } = useParams()
  const [postDetails, setpostDetails] = useState(null)


  async function getPostDetails() {
    const response = await getSinglePost(id)
    console.log(response);

    if (response.message === 'success') {

      setpostDetails(response.post)
    }

  }


  useEffect(() => {
    getPostDetails()
  }, [id])
  return <>
    <div className="bg-[#0f1419] min-h-screen py-6">
      {postDetails ? <PostCard callback={getPostDetails} allComment={true} post={postDetails}/> : <LoadingPage/> }
    </div>
  </>
}