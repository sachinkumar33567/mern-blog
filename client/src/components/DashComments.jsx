import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import {Button, Modal, Table, TableHeadCell} from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi"

export default function DashComments() {
    const {currentUser} = useSelector(state => state.user)
    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [commentIdToDelete, setCommentIdToDelete] = useState(null)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
            console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchComments()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = comments.length
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setComments([...comments, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'delete'
            })

            const data = await res.json()
            if (res.ok) {
                setComments(comments.filter(comment => comment._id !== commentIdToDelete))
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console(error.message)
        }
    }

    return <div className="p-3 w-full table-auto overflow-x-scroll md:mx-auto
                    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
                    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {currentUser.isAdmin && comments.length > 0? (
            <>
                <Table hoverable className="shadow-md">
                    <Table.Head>
                        <TableHeadCell>Updated Date</TableHeadCell>
                        <TableHeadCell>Content</TableHeadCell>
                        <TableHeadCell>Likes</TableHeadCell>
                        <TableHeadCell>Post Id</TableHeadCell>
                        <TableHeadCell>User Id</TableHeadCell>
                        <TableHeadCell>Delete</TableHeadCell>
                    </Table.Head>
                    {comments.map(comment => (
                        <Table.Body key={comment._id}>
                            <Table.Row className="hover:bg-gray-300 dark:bg-gray-800">

                                <Table.Cell>
                                    {new Date(comment.updatedAt).toLocaleDateString()}
                                </Table.Cell>

                                <Table.Cell>
                                    {comment.content}
                                </Table.Cell>

                                <Table.Cell>
                                    {comment.numberOfLikes}
                                </Table.Cell>

                                <Table.Cell>
                                    {comment.postId}
                                </Table.Cell>

                                <Table.Cell>
                                    {comment.userId}
                                </Table.Cell>

                                <Table.Cell>
                                    <span className="font-medium text-red-500
                                    hover:underline cursor-pointer"
                                    onClick={() => {
                                        setShowModal(true)
                                        setCommentIdToDelete(comment._id)
                                    }}>
                                        Delete
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
                {showMore && (
                    <div className="flex justify-center mt-3">
                        <button onClick={handleShowMore}
                            className="text-teal-500 text-sm">
                                Show more
                        </button>
                    </div>
                )}
            </>
        ) : (
            <p>You have no comments yet!</p>
        )}
        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size='md'
        >
            <Modal.Header/>
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14
                    text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='text-lg text-gray-500 dark:text-gray-400 mb-5'>
                        Are you sure you want to delete this comment?
                    </h3>
                    <div className='flex justify-between'>
                        <Button color='failure' onClick={handleDeleteComment}>
                            Yes I'm sure
                        </Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
}
