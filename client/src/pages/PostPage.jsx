import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {Button, Spinner} from 'flowbite-react'
import CallToAction from "../components/CallToAction"
import CommentSection from "../components/CommentSection"
import PostCard from "../components/PostCard"

export default function PostPage() {
    const {postSlug} = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                setLoading(false)
                if (res.ok) {
                    setPost(data.posts[0])
                    setError(false)
                } else {
                    setError(true)
                    return
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`)
                const data = await res.json()
                if (res.ok) {
                    setRecentPosts(data.posts)
                }
            }

            fetchRecentPosts()
        } catch (error) {
            console.log(error.message)
        }
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size='xl'/>
        </div>
    )
    return (
        <div className="min-h-screen p-3 max-w-6xl mx-auto flex flex-col">
            <h1 className="text-3xl lg:text-4xl text-center p-3 mt-8
                    max-w-2xl mx-auto"> 
                {post && post.title}
            </h1>
            <Link to={`/search?category=${post && post.category}`}
                className="self-center mt-5">
                <Button size='xs' color="gray">{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title}
            className="p-3 mt-9 max-h-[600px] w-full object-cover rounded-sm"/>
            <div className="flex justify-between p-3 border-b-2 border-slate-500">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div dangerouslySetInnerHTML={{__html: post && post.content}}
                className="p-3 w-full max-w-2xl mx-auto post-content">

            </div>
            <div className="w-full max-w-4xl mx-auto">
                <CallToAction/>
            </div>
            <CommentSection postId={post && post._id}/>
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent Posts</h1>
                <div className="flex flex-wrap gap-5 justify-center mt-5">
                    {recentPosts && recentPosts.map(post => (
                        <PostCard key={post._id} post={post}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
