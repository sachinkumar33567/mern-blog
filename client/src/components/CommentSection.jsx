import { Alert, Button, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'
export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    
    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const res = await fetch('/api/comment/create', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            })

            const data = await res.json()
            if (res.ok) {
                setComment('')
                setCommentError(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError(error.message);
        }
    }

    useEffect(() => {
        try {
            const getCommetns = async () => {
                const res = await fetch(`/api/comment/get/${postId}`, {
                    method: 'get'
                })

                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }
            }
            getCommetns()
        } catch (error) {
            console.log(error.message);
        }
    }, [postId])

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/signin')
                return
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'put'
            })

            if (res.ok) {
                const data = await res.json()
                setComments(comments.map(comment => (comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.numberOfLikes
                    } : comment
                )))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setComments(comments.map(c =>
            c._id === comment._id ? {...c, content: editedContent}: c
        ))
    }

    const handleDelete = async (commentId) => {
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'delete'
            })
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='w-full max-w-2xl mx-auto p-3'>
            {currentUser? (
                <div className='flex gap-1 justify-center items-center text-gray-500 my-5'>
                    <p>Signed in as</p>
                    <Link to='/dashboard?tab=profile'>
                        <img src={currentUser.profilePicture} alt={currentUser.username}
                        className='h-6 rounded-full object-cover'/>                        
                    </Link>
                    <Link to='/dashboard?tab=profile' className='text-sm text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ): (
                <div className='flex gap-1 justify-center items-center text-teal-500'>
                    You must be Signed In to write a comment
                    <Link to='/signin' className='text-blue-600'>
                        Sign In
                    </Link>
                </div>
            )}
            
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea placeholder='Add a comment...'
                            rows='3' maxLength='200'
                            className='text-md'
                            onChange={event => {setComment(event.target.value)}}
                            value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-sm text-gray-500'>{200 - comment.length} characters remaining</p>
                        <Button type='submit' gradientDuoTone='purpleToBlue' outline size='sm'>
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <Alert color='failure'>
                            {commentError}
                        </Alert>
                    )}
                </form>
            )}

            {comments? (
                <>
                    <div className='flex gap-1 items-center my-5 text-sm'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            {comments.length}
                        </div>
                    </div>
                    {comments.map(comment => (
                        <Comment
                        key={comment._id}
                        comment={comment}
                        onLike={handleLike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        />
                    ))}
                </>
            ): (
                <p>No comments yet!</p>
            )}
        </div>
    )
}
