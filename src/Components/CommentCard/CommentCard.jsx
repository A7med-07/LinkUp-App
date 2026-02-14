import React, { useContext } from 'react'
import userImg from '../../assets/user.jpg'
import CommentDropDown from '../CommentDropDown/CommentDropDown'
import { AuthContext } from '../../context/authContext'

export default function CommentCard({comment , id , callback}) {
 const {userData} = useContext(AuthContext)
  return <>
  
      <div className="w-full min-h-16 bg-[#242938] border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex items-start justify-between gap-3 transition-all duration-300">
        <div className="flex items-start gap-3 flex-1">
          <img 
            className="rounded-full w-10 h-10 object-cover ring-2 ring-gray-700" 
            onError={(e)=>{e.target.src=userImg}} 
            src={comment?.commentCreator.photo} 
            alt='user' 
          />
          <div className="flex-1">    
            <h3 className="text-sm font-bold text-white hover:text-purple-400 transition-colors cursor-pointer">
              {comment?.commentCreator.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {comment?.createdAt.split('.').slice(0,1).join(' ').replace('T' , ' ')}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {comment?.content}
            </p>
          </div>
        </div>
        {comment.commentCreator._id == userData._id && userData._id == id && (
          <CommentDropDown callback={callback} CommentId={comment._id}/>
        )}
      </div>
  
  
  </>
}