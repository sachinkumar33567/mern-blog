import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard'

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromURL = urlParams.get('searchTerm')
    const sortFromURL = urlParams.get('sort')
    const categoryFromURL = urlParams.get('category')

    setSidebarData({
      ...sidebarData,
      searchTerm: searchTermFromURL,
      sort: sortFromURL || 'desc',
      category: categoryFromURL || 'uncategorized'
    })

    const fetchPosts = async () => {
      try {
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/post/getposts?${searchQuery}`)
        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts)
          if (posts.length === 9) {
            setShowMore(true)
          } else {
            setShowMore(false)
          }
        }

        setLoading(false)

      } catch (error) {
        console.log(error.message)
      }
    }

    fetchPosts()
  }, [location.search])

  const handleChange = (event) => {
    const {id, value} = event.target

    if (id === 'searchTerm') {
      setSidebarData({
        ...sidebarData,
        searchTerm: value
      })
    }

    if (id === 'sort') {
      const order = value || 'desc'
      setSidebarData({
        ...sidebarData,
        sort: order
      })
    }

    if (id === 'category') {
      const category = value || 'uncategorized'
      setSidebarData({
        ...sidebarData,
        category
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    const {searchTerm, sort, category} = sidebarData
    urlParams.set('searchTerm', searchTerm)
    urlParams.set('sort', sort)
    urlParams.set('category', category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  const handleShowmore = async () => {
    const startIndex = posts.length
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`/api/post/getposts?${searchQuery}`)
    if (res.ok) {
      const data = await res.json()
      setPosts([...posts, ...data.posts])
      if (data.posts.length === 9) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
    }
  }
  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 md:min-h-screen shadow-lg shadow-gray-400">
            <form className="flex flex-col gap-8"
              onSubmit={handleSubmit}>
              <div className="flex gap-2 items-center">
                <label
                htmlFor="searchTerm"
                className="whitespace-nowrap text-gray-500 font-semibold">
                  Search Term :
                </label>
                <TextInput
                type="text"
                id="searchTerm"
                placeholder="Search..."
                defaultValue={sidebarData.searchTerm}
                onChange={handleChange}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label
                htmlFor="sort"
                className="whitespace-nowrap text-gray-500 font-semibold">
                  Sort :
                </label>
                <Select
                  id="sort"
                  value={sidebarData.sort}
                  onChange={handleChange}  
                >
                  <option value="desc">Latest</option>
                  <option value="asc">Oldest</option>        
                </Select>
              </div>
              <div className="flex gap-2 items-center">
                <label
                htmlFor="category"
                className="whitespace-nowrap text-gray-500 font-semibold">
                  Category :
                </label>
                <Select
                  id="category"
                  value={sidebarData.category}
                  onChange={handleChange}  
                >
                  <option value="uncategorized">Uncategorized</option>
                  <option value="javascript">JavaScript</option>        
                  <option value="reactjs">React.js</option>        
                  <option value="nextjs">Next.js</option>        
                </Select>
              </div>
              <Button type="submit" gradientDuoTone='purpleToPink' outline>
                Apply filters
              </Button>
            </form>
        </div>
        <div className="w-full">
          <h1 className="text-3xl font-semibold sm:border-b-2 border-gray-500 p-3 mt-5">
            Post results
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {!loading && posts.length===0 && (
              <p className="text-xl text-gray-500">No posts found.</p>
            )}

            {loading && (
              <p className="text-xl text-gray-500">Loading...</p>
            )}

            {!loading && posts && posts.map(post => (
              <PostCard key={post._id} post={post}/>
            ))}

            {showMore && (
              <button
                className="text-lg text-teal-500 p-7 hover:underline w-full"
                onClick={handleShowmore}
              >
                Show more
              </button>
            )}
          </div>
        </div>
    </div>
  )
}