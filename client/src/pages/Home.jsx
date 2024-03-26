import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'
export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch('/api/post/getposts', {
          method: 'get'
        })

        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts)
        }
      }

      fetchPosts()
    } catch (error) {
      console.log(error.message)
    }
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 max-w-6xl mx-auto'>
        <h1 className='text-3xl lg:text-6xl font-bold'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-sm sm:text-md'>Here you'll find a varity of articles and tutorials on topics
          such as web development, software engineering and programming languages.
        </p>
        <Link
        to='/search'
        className='font-bold text-teal-500 text-sm hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700 shadow-lg'>
        <CallToAction/>
      </div>
      <div className='p-3 max-w-6xl mx-auto flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {posts.map(post => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link to='/search' className='text-lg text-teal-500 text-center hover:underline'>
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
