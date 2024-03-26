import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import {Button, Modal, Table, TableHeadCell} from 'flowbite-react'
import { HiOutlineExclamationCircle } from "react-icons/hi"
import {FaCheck, FaTimes} from 'react-icons/fa'

export default function DashUsers() {
    const {currentUser} = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [userIdToDelete, setUserIdToDelete] = useState(null)
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`)
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
            console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setUsers([...users, ...data.users])
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'delete'
            })

            const data = await res.json()
            if (res.ok) {
                setUsers(users.filter(user => user._id !== userIdToDelete))
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
        {currentUser.isAdmin && users.length > 0? (
            <>
                <Table hoverable className="shadow-md">
                    <Table.Head>
                        <TableHeadCell>Signed Up Date</TableHeadCell>
                        <TableHeadCell>Profile Picture</TableHeadCell>
                        <TableHeadCell>Username</TableHeadCell>
                        <TableHeadCell>Email</TableHeadCell>
                        <TableHeadCell>Admin</TableHeadCell>
                        <TableHeadCell>Delete</TableHeadCell>
                    </Table.Head>
                    {users.map(user => (
                        <Table.Body key={user._id}>
                            <Table.Row className="hover:bg-gray-300 dark:bg-gray-800">

                                <Table.Cell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </Table.Cell>

                                <Table.Cell>
                                    <img src={user.profilePicture} alt={user.username}
                                        className="h-12 object-cover bg-gray-500 rounded-full"/>
                                </Table.Cell>

                                <Table.Cell>{user.username}</Table.Cell>

                                <Table.Cell>{user.email}</Table.Cell>

                                <Table.Cell>
                                    {user.isAdmin?
                                    <FaCheck className="text-lg text-green-600 my-auto mx-auto"/>:
                                    <FaTimes className="text-lg text-red-600 my-auto mx-auto"/>}
                                </Table.Cell>

                                <Table.Cell>
                                    <span className="font-medium text-red-500
                                    hover:underline cursor-pointer"
                                    onClick={() => {
                                        setShowModal(true)
                                        setUserIdToDelete(user._id)
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
            <p>You have no users yet!</p>
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
                        Are you sure you want to delete this user?
                    </h3>
                    <div className='flex justify-between'>
                        <Button color='failure' onClick={handleDeleteUser}>
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
