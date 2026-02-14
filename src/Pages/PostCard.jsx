import React, { useContext, useState } from 'react'
import CommentCard from '../Components/CommentCard/CommentCard'
import { Link } from 'react-router-dom'
import { Button, Input } from '@heroui/react'
import { createMyComment } from '../services/commentApi'
import PostDropDown from '../Components/PostDropDown/PostDropDown'
import { AuthContext } from '../context/authContext'
import getAllPosts from './postApi'
import { ThumbsUp, Heart, MessageCircle, Share2, Send } from 'lucide-react'

export default function PostCard({ post , allComment , callback}) {
const {userData} = useContext(AuthContext)
const [commentContent , setcommentContent] = useState('')

const [isLouding , setisLouding] = useState(false)

async function creatComment(e) {
  e.preventDefault();
  if (!commentContent.trim()) return;

  setisLouding(true);

  try {
    const response = await createMyComment(commentContent, post.id);
    console.log(response);

    if (response.message === "success") {
      await callback();
      setcommentContent("");
    }
  } catch (error) {
    console.error(error);
  }

  setisLouding(false);
}


  return <>

    <div className="w-full flex flex-col px-3 lg:px-6">

      <div className="w-full max-w-5xl mx-auto">

        <div className="bg-[#1a1f2e] w-full rounded-2xl shadow-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 h-auto py-5 px-5 my-4">
          
          {/* Post Header */}
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  className="rounded-full w-12 h-12 object-cover ring-2 ring-purple-500/30" 
                  src={post.user.photo} 
                  alt='user' 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1f2e]"></div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white hover:text-purple-400 transition-colors cursor-pointer">
                  {post.user.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {post.createdAt.split('.').slice(0, 1).join(' ').replace('T', ' ')}
                </p>
              </div>
            </div>
            {userData?._id == post.user._id && <PostDropDown postId={post.id} callback={callback}/>}
          </div>

          {/* Post Body */}
          {post.body && (
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              {post.body}
            </p>
          )}
          
          {/* Post Image */}
          {post.image && (
            <div className="relative mb-4 rounded-xl overflow-hidden group">
              <img 
                src={post.image} 
                className='w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-105' 
                alt={post.body} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          {/* Reactions Counter */}
          <div className="w-full flex items-center px-2 py-3 border-b border-gray-800">
            <div className="flex items-center gap-1">
              <div className="bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                <ThumbsUp className="w-3 h-3 text-white fill-current" />
              </div>
              <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center -ml-2 shadow-lg">
                <Heart className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            <div className="w-full flex justify-between ml-3">
              <span className="text-gray-400 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                26
              </span>
              <Link 
                to={`/singlepost/${post.id}`}
                className="text-gray-400 text-sm font-medium hover:text-purple-400 transition-colors"
              >
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 py-3 border-b border-gray-800">
            <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group">
              <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Like</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Comment</span>
            </button>
            
            <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm">Share</span>
            </button>
          </div>

          {/* Add Comment Form */}
          <div className='w-full pt-4'>
            <form onSubmit={creatComment} className='flex gap-3'>
              <Input 
                value={commentContent} 
                onChange={(e) => setcommentContent(e.target.value)} 
                variant='bordered' 
                placeholder='Write a comment...'
                classNames={{
                  input: "bg-[#242938] text-gray-200",
                  inputWrapper: "bg-[#242938] border-gray-700 hover:border-purple-500 focus-within:border-purple-500"
                }}
                className="flex-1"
              />
              <Button 
                isLoading={isLouding} 
                type='submit' 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg min-w-0 px-4"
                isIconOnly
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>

          {/* Comments */}
          <div className="mt-4 space-y-3">
            {post.comments.length > 0 && allComment == false ? (
              <CommentCard callback={callback} id={post.user._id} comment={post.comments[0]} />
            ) : (
              post.comments.map((comment) => {
                return <CommentCard key={comment._id} comment={comment} callback={callback} id={post.user._id} />
              })
            )}
          </div>

        </div>
      </div>
    </div>

  </>
}