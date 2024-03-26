import { useEffect, useState } from "react"
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import { useSelector } from "react-redux"
import { Button, Textarea } from "flowbite-react"

export default function Comment({comment, onLike, onEdit, onDelete}) {
    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState('')
    const {currentUser} = useSelector(state => state.user)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`, {
                    method: 'get'
                })
    
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }                
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser()
    }, [comment])

    const handleEdit = async () => {
        setIsEditing(true)
        setEditedContent(comment.content)
    }

    const handleSave = async (event) => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content: editedContent})
            })

            if (res.ok) {
                setIsEditing(false)
                onEdit(comment, editedContent)                
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="flex p-4 border-b dark:border-gray-600 text-sm">
            <div className="flex-shrink-0 mr-3">
                <img className="h-8 rounded-full bg-gray-200" src={user.profilePicture} alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="text-xs mb-1">
                    <span className="font-bold mr-2 truncate">
                        {user? `@${user.username}`: 'anonymous user'}
                    </span>
                    <span className="text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                        className="mb-2"
                        value={editedContent}
                        onChange={event => setEditedContent(event.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                            type="button"
                            size='xs'
                            gradientDuoTone='purpleToBlue'
                            onClick={handleSave}
                            >
                                Save
                            </Button>
                            <Button
                            type="button"
                            size='xs'
                            gradientDuoTone='purpleToBlue'
                            outline
                            onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>{comment.content}</p>
                        <div className="mt-2 pt-1 flex gap-2 text-xs border-t text-gray-400
                                    dark:border-gray-700 max-w-fit">
                            <button
                            type="button"
                            onClick={() => {onLike(comment._id)}}
                            className={`text-sm hover:text-blue-600
                            ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-600'}`}
                            >
                                <FaThumbsUp/>
                            </button>
                            <p className="">{comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (
                                comment.numberOfLikes === 1? 'like' : 'likes'
                            )}</p>
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <button
                                type="button"
                                onClick={handleEdit}
                                className="font-semibold">Edit</button>                        
                            )}
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <button
                                type="button"
                                onClick={() => onDelete(comment._id)}
                                className="font-semibold">Delete</button>                        
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}