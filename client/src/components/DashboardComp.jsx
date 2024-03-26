import { Button, Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function DashboardComp() {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)
    const {currentUser} = useSelector(state => state.user)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`, {
                    method: 'get'
                })
    
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }                
            } catch (error) {
                console.log(error.message)
            }
        }

        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts`, {
                    method: 'get'
                })
    
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data.posts)
                    setTotalPosts(data.totalPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }                
            } catch (error) {
                console.log(error.message)
            }
        }

        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`, {
                    method: 'get'
                })
    
                if (res.ok) {
                    const data = await res.json()
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }                
            } catch (error) {
                console.log(error.message)
            }
        }

        if (currentUser.isAdmin) {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser])
    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col gap-4 w-full p-3 rounded-md shadow-lg
                            dark:bg-slate-800 md:w-72">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="text-5xl bg-teal-600 text-white
                        rounded-full p-3 shadow-lg"/>
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthUsers}
                        </span>
                        <p className="text-gray-500">
                            Last month
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full p-3 rounded-md shadow-lg
                            dark:bg-slate-800 md:w-72">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="text-5xl bg-lime-600 text-white
                        rounded-full p-3 shadow-lg"/>
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthPosts}
                        </span>
                        <p className="text-gray-500">
                            Last month
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full p-3 rounded-md shadow-lg
                            dark:bg-slate-800 md:w-72">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="text-5xl bg-indigo-600 text-white
                        rounded-full p-3 shadow-lg"/>
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp/>
                            {lastMonthComments}
                        </span>
                        <p className="text-gray-500">
                            Last month
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 my-4 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-lg p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 font-semibold">
                        <h1 className="p-2 text-center">Recent users</h1>
                        <Link to='/dashboard?tab=users'>
                            <Button gradientDuoTone='purpleToPink' outline size='sm'>See all</Button>
                        </Link>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Profile Picture</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users && users.map(user => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700
                                            hover:bg-gray-200">
                                    <Table.Cell>
                                        <img src={user.profilePicture} alt="user"
                                            className="h-10 rounded-full bg-gray-500"/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-lg p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 font-semibold">
                        <h1 className="p-2 text-center">Recent posts</h1>
                        <Link to='/dashboard?tab=posts'>
                            <Button gradientDuoTone='purpleToPink' outline size='sm'>See all</Button>
                        </Link>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post Image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map(post => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700
                                            hover:bg-gray-200">
                                    <Table.Cell>
                                        <img src={post.image} alt="post"
                                            className="h-14 rounded-sm bg-gray-500 object-cover"/>
                                    </Table.Cell>
                                    <Table.Cell className="w-96">
                                        {post.title}
                                    </Table.Cell>
                                    <Table.Cell className="w-5">
                                        {post.category}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-lg p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between items-center p-3 font-semibold">
                        <h1 className="p-2 text-center">Recent comments</h1>
                        <Link to='/dashboard?tab=comments'>
                            <Button gradientDuoTone='purpleToPink' outline size='sm'>See all</Button>
                        </Link>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map(comment => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700
                                            hover:bg-gray-200">
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}
