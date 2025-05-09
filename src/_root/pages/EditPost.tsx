import PostForm from '@/components/forms/PostForm'
import { useGetPostById } from '@/lib/react-query/queriesAndMutuations';
import { Loader } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom'

const EditPost= () => {
  const {id} = useParams();
  const {data:post, isPending} = useGetPostById(id||"");
  if(isPending) return <div><Loader/></div>
  return (
    <div className='flex flex-1'>
      <div className='common-container'> 
        <div className='max-w-5xl flex-start gap-3 justify'>
        <img 
        src="/assets/icons/add-post.svg"
        width={36}
        height={36} 
        alt="add" 
        />
        <h2 className='h3-bold md: h2-bold text-left'>Edit Post</h2>
        </div>
        <PostForm
        action="Update"
        post={post}/>
      </div>
    </div>
  )
}

export default EditPost